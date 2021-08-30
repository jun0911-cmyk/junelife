
import * as joi from 'joi';

import { hostname } from 'os';
import { isIPv6 } from 'net';
import { Socket, createSocket } from 'dgram';
import { EventEmitter } from 'events';

export const { name, version } = require('../package.json');

const debug = require('debug')(name);

// https://tools.ietf.org/html/rfc5424#section-6.2.1

export const FACILITY = {
    kern: 0,
    user: 1,
    mail: 2,
    daemon: 3,
    auth: 4,
    syslog: 5,
    lpr: 6,
    news: 7,
    uucp: 8,
    cron: 9,
    security: 10,
    ftp: 11,
    ntp: 12,
    logaudit: 13,
    logalert: 14,
    clock: 15,
    local0: 16,
    local1: 17,
    local2: 18,
    local3: 19,
    local4: 20,
    local5: 21,
    local6: 22,
    local7: 23,
};

export const SEVERITY = {
    EMERG: 0,
    ALERT: 1,
    CRIT: 2,
    ERROR: 3,
    WARNING: 4,
    NOTICE: 5,
    INFO: 6,
    DEBUG: 7,
};

export const NILVALUE = '-';

export const BOM = new Buffer('EFBBBF', 'hex');

const DELIMITER = new Buffer(' ', 'ascii');

/**
 * Syslog UDP options.
 */
export interface RemoteSyslogOptions {
    /**
     * Host to which to send packets.
     */
    target_host?: string;

    /**
     * UDP port to which to send packets.
     */
    target_port?: number;

    /**
     * Sender's [APPNAME]. Defaults to NILVALUE, i.e. `-`.
     *
     * [APPNAME]: https://tools.ietf.org/html/rfc5424#section-6.2.5
     */
    appname?: string;

    /**
     * Sender's [facility]. Defaults to `local0`.
     *
     * [facility]: https://tools.ietf.org/html/rfc5424#section-6.2.1
     */
    facility?: number | keyof typeof FACILITY;

    /**
     * Sender's [HOSTNAME]. Defaults to `os.hostname()`.
     *
     * [HOSTNAME]: https://tools.ietf.org/html/rfc5424#section-6.2.4
     */
    hostname?: string;

    /**
     * Sender's [PROCID]. Defaults to `process.pid`.
     *
     * [PROCID]: https://tools.ietf.org/html/rfc5424#section-6.2.6
     */
    procid?: string;
}

/**
 * Message send options.
 */
export interface RemoteSyslogSendOptions {
    /**
     * Timestamp of this message, as ms since epoch. Defaults to `Date.now()`.
     */
    timestamp?: number;

    /**
     * [MSGID]. Defaults to NILVALUE, i.e. `-`.
     *
     * [MSGID]: https://tools.ietf.org/html/rfc5424#section-6.2.7
     */
    msgid?: string;
}

const optionsSchema = joi.object({
    target_host: joi.string().empty(null).default('127.0.0.1'),
    target_port: joi.number().integer().empty(null).default(514),
    hostname: joi.string().default(hostname()),
    appname: joi.string().default(NILVALUE),
    facility: joi.alternatives([
        joi.string().empty(null).valid(Object.keys(FACILITY)),
        joi.number().integer().min(0).max(23),
    ]).default(FACILITY.local0),
    procid: joi.string().default(process.pid),
}).default();

const severitySchema = joi.number().integer().min(0).max(7);

const sendOptionsSchema = joi.object({
    timestamp: joi.number().integer().default(0),
    msgid: joi.string().default(NILVALUE),
}).default();

const messageSchema = joi.string().min(1).max(1024);

/**
 * A remote syslog client. Sends over UDP.
 */
export class RemoteSyslog extends EventEmitter {
    private options: RemoteSyslogOptions;
    private socket: Socket;
    private pending: Buffer[];
    private running: boolean;

    constructor(options?: RemoteSyslogOptions) {
        options = joi.attempt(options, optionsSchema);
        debug('constructing...', options);
        super();
        this.options = {
            ... options, // copy of options
            facility: getFacilityCode(options.facility), // with a numeric facility
        };
        this.pending = [];
        this.handleSendResult = this.handleSendResult.bind(this);
        this.running = false;
    }

    /**
     * Create an open a socket, if necessary.
     * Either way, return it.
     */
    public connect(): Socket {
        if (this.socket) {
            return this.socket;

        } else {
            const version = isIPv6(this.options.target_host) ? 'udp6' : 'udp4';
            debug(`socket opening (${version})`);
            const socket = this.socket = createSocket({
                reuseAddr: true,
                type: version,
            });
            this.socket.on('close', () => this.socketClose());
            this.socket.on('error', err => this.socketError(err));
            this.socket.unref();
            debug(`socket open`);
            return socket;
        }
    }

    /**
     * Handle the socket's `close` event'.
     */
    private socketClose() {
        debug('socket closed');
        this.socket = null;
    }

    /**
     * Propagate the socket's `error` event.
     */
    private socketError(err: Error) {
        debug('socket error', err.message);
        this.emit('error', err);
        this.disconnect();
    }

    /**
     * Close the socket, if it's still open.
     */
    public disconnect(): void {
        if (this.socket) {
            debug('socket closing...');
            this.socket.close();
            this.socket = null;
        }
    }

    /**
     * Send a message to the remote syslogd. Pretends to be synchronous.
     */
    public send(severity: number, message: string, options?: RemoteSyslogSendOptions): void {
        severity = joi.attempt(severity, severitySchema);
        message = joi.attempt(message, messageSchema);
        options = joi.attempt(options, sendOptionsSchema);
        const facility = this.options.facility as number;
        const priority = facility << 3 | severity;
        const { hostname, appname, procid } = this.options;
        const { timestamp, msgid } = options;
        const tsrep = new Date(timestamp || Date.now()).toISOString();
        const header = `<${priority}>1 ${tsrep} ${hostname} ${appname} ${procid} ${msgid}`;
        const structured = NILVALUE;
        const buf = Buffer.concat([
            new Buffer(header, 'ascii'),
            DELIMITER,
            new Buffer(structured, 'ascii'),
            DELIMITER,
            BOM,
            new Buffer(message, 'utf8'),
        ]);
        this.queueMessage(buf);
    }

    /**
     * Queue another buffer to be sent.
     */
    private queueMessage(buf: Buffer): void {
        debug('queue', buf.toString());
        this.pending.push(buf);
        this.start();
    }

    /**
     * Send the next message.
     */
    private sendNextMessage() {
        if (!this.pending.length) {
            debug('spurious sendNextMessage');
            this.stop();
            return;
        }

        const buf = this.pending.shift();
        this.continue();

        if (!buf) {
            debug('undefined buf');
            return;
        }

        try {
            const socket = this.connect();
            const { target_port, target_host } = this.options;
            socket.send(buf, 0, buf.byteLength, target_port, target_host, this.handleSendResult);

        } catch (err) {
            this.handleSendResult(err);
        }
    }

    /**
     * Handle send results. On errors, report them upstream. That could be
     * ignored, result in our destruction and re-creation, or result in the
     * process crashing. So, we keep sending anyway, as we're the only object
     * with a reference to the unsent messages.
     */
    private handleSendResult(err?: Error, bytes?: number): void {
        if (err) {
            debug('error', err);
            this.emit('error', err);

        } else {
            debug('sent', bytes);
        }
    }

    /**
     * Start sending.
     */
    private start() {
        if (!this.running) {
            this.running = true;
            this.continue();
        }
    }

    /**
     * Continue sending if there are more packets, else stop.
     */
    private continue() {
        if (this.pending.length) {
            setImmediate(() => this.sendNextMessage());

        } else {
            this.stop();
        }
    }

    /**
     * Stop sending.
     */
    private stop() {
        if (this.running) {
            this.running = false;
        }
    }
}

/**
 * Get a facility code from a facility code, stringifified code, or name.
 */
function getFacilityCode(facility: number | keyof typeof FACILITY): number {
    const int = parseInt('facility', 10);

    if (typeof facility === 'number') {
        return facility;

    } else if (!isNaN(int)) {
        return int;

    } else if (facility in FACILITY) {
        return FACILITY[facility];

    } else {
        throw new Error(`bad facility: ${facility}`);
    }
}
