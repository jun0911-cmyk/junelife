import { expect } from 'code';
import { script } from 'lab';
export const lab = script();

import { createSocket, Socket } from 'dgram';
import { RemoteSyslog, SEVERITY, FACILITY, NILVALUE, BOM } from '../src';
import { hostname } from 'os';

const { experiment, test, before, after } = lab;
const debug = require('debug')('rsyslog-test');

experiment('syslog over UDP', () => {
    let socket: Socket;
    let messages: Buffer[] = [];
    let address: string;
    let port: number;

    before(() => new Promise(resolve => {
        socket = createSocket('udp4');
        socket.on('listening', () => {
            const addr = socket.address();
            debug('listening', addr);
            address = addr.address;
            port = addr.port;
        });

        socket.on('message', message => {
            messages.push(message);
        });
        
        socket.unref();
        socket.bind(0, '127.0.0.1', resolve);
    }));
    
    after(() => new Promise(resolve => {
        socket.close(resolve);
    }));

    test('smallest testable example', async () => {
        clearMessages();

        const rsyslog = new RemoteSyslog({
            target_host: address,
            target_port: port,
        });
        rsyslog.once('error', () => { /* la la la la a */ });
        rsyslog.send(SEVERITY.NOTICE, "I'm awake!", {
            timestamp: 1521416285134,
        });

        await waitLongEnough();

        expect(messages.length, 'packet count').to.equal(1);
        expect(messages[0].toString(), 'packet').to.equal(`<133>1 2018-03-18T23:38:05.134Z ${hostname()} - ${process.pid} - - ${BOM.toString()}I\'m awake!`);
    });

    test('sync send twice', async () => {
        clearMessages();

        const rsyslog = new RemoteSyslog({
            target_host: address,
            target_port: port,
        });
        rsyslog.once('error', () => { /* la la la la a */ });
        rsyslog.send(SEVERITY.NOTICE, "I'm awake!", {
            timestamp: 1521416285134,
        });
        rsyslog.send(SEVERITY.NOTICE, "I'm still awake!", {
            timestamp: 1521416285135,
        });

        await waitLongEnough();

        expect(messages.length, 'packet count').to.equal(2);
        expect(messages[0].toString(), 'packet').to.equal(`<133>1 2018-03-18T23:38:05.134Z ${hostname()} - ${process.pid} - - ${BOM.toString()}I\'m awake!`);
        expect(messages[1].toString(), 'packet').to.equal(`<133>1 2018-03-18T23:38:05.135Z ${hostname()} - ${process.pid} - - ${BOM.toString()}I\'m still awake!`);
    });

    test('overriding hostname, appname, facility, severity, and msgid', async () => {
        clearMessages();

        const rsyslog = new RemoteSyslog({
            target_host: address,
            target_port: port,
            hostname: 'sender',
            appname: 'appname',
            facility: FACILITY.local7,
        });
        rsyslog.once('error', () => { /* la la la la a */ });
        rsyslog.send(SEVERITY.EMERG, "I'm awake!", {
            timestamp: 1521416285134,
            msgid: 'operation'
        });

        await waitLongEnough();

        expect(messages.length, 'packet count').to.equal(1);
        expect(messages[0].toString(), 'packet').to.equal(`<184>1 2018-03-18T23:38:05.134Z sender appname ${process.pid} operation - ${BOM.toString()}I\'m awake!`);
    });

    test('RFC5424 section 6.5 example 1', async () => {
        clearMessages();

        const rsyslog = new RemoteSyslog({
            target_host: address,
            target_port: port,
            hostname: 'mymachine.example.com',
            appname: 'su',
            facility: 4,
            procid: NILVALUE,
        });
        rsyslog.once('error', () => { /* la la la la a */ });
        rsyslog.send(2, "'su root' failed for lonvick on /dev/pts/8", {
            timestamp: new Date('2003-10-11T22:14:15.003Z').valueOf(),
            msgid: 'ID47'
        });

        await waitLongEnough();

        expect(messages.length, 'packet count').to.equal(1);
        // BOM disappears:
        expect(messages[0].toString(), 'packet').to.equal('<34>1 2003-10-11T22:14:15.003Z mymachine.example.com su - ID47 - ' + BOM.toString() + '\'su root\' failed for lonvick on /dev/pts/8');
    });

    /** Clear the messages */
    function clearMessages() {
        messages.splice(0); // flush
    }

    /** Wait a little, as the send operation is faux-synchronous */
    async function waitLongEnough() {
        await new Promise(cb => setTimeout(cb, 5));
    }
});
