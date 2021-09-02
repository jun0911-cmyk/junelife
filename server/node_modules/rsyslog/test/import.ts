import { expect } from 'code';
import { script } from 'lab';
export const lab = script();

import * as pkg from '../src';

const { name, version } = require('../package.json');
const { experiment, test } = lab;

experiment(name, () => {
    experiment('import', () => {
        test('name', async () => {
            expect(pkg.name).to.equal(name);
        });

        test('version', async () => {
            expect(pkg.version).to.equal(version);
        });
    });
});
