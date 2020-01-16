import { Dexie as DexieImport } from 'dexie';
import { encrypted, Encryption } from '../../../src';

declare interface DexieEncryptedAddon { encrypted: typeof encrypted; Encryption: typeof Encryption; }

/*
 * Lib is not really ment for node but package should be able to be required in node.
 */
describe('Dexie', () => {
    describe('Node require', () => {
        let DexieReq: typeof DexieImport;
        let DexieEncryptionAddonReq: DexieEncryptedAddon;
        beforeAll(() => {
            DexieReq = require('dexie');
            DexieEncryptionAddonReq = require('../../../dist/index');
        });
        it('should load Dexie.js', () => {
            expect(DexieReq).toBeTruthy();
        });
        it('should load DexieEncryptionAddon.js', () => {
            expect(DexieEncryptionAddonReq).toBeTruthy();
            expect(DexieEncryptionAddonReq.encrypted).toBeTruthy();
            expect(DexieEncryptionAddonReq.Encryption).toBeTruthy();
        });
        it('should be able to create a database with encryption', async () => {
            const test = DexieEncryptionAddonReq.Encryption.createRandomEncryptionKey();
            expect(typeof test === 'string').toBeTrue();
        });
    });
});
