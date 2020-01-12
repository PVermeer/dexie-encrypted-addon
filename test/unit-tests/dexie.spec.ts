import { TestDatabase } from '../mocks/mocks';
import { Encryption } from '../../src';

describe('Dexie', () => {
    it('should create database', async () => {
        const db = new TestDatabase('Test database');
        expect(db).toBeTruthy();
        await db.delete();
    });
    it('should create database with provided secretKey', async () => {
        const secret = Encryption.createRandomEncryptionKey();
        const db = new TestDatabase('Test database', secret);
        expect(db).toBeTruthy();
        await db.delete();
    });
});
