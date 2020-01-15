import { databasesPositive } from '../mocks/mocks';

describe('Dexie', () => {
    describe('Import', () => {
        databasesPositive.forEach(database => {
            let db: ReturnType<typeof database.db>;
            beforeEach(async () => {
                db = database.db();
                await db.open();
            });
            afterEach(async () => {
                await db.delete();
            });
            describe(database.desc, () => {
                it('should create database', async () => {
                    expect(db).toBeTruthy();
                    expect(db.isOpen()).toBeTrue();
                });
            });
        });
    });
    describe('HTML script', () => {
        beforeAll(() => {
            return Promise.all([
                new Promise(resolve => {
                    const scriptDexie = document.createElement('script');
                    scriptDexie.src = 'https://unpkg.com/dexie@latest/dist/dexie.js';
                    scriptDexie.type = 'text/javascript';
                    scriptDexie.onload = () => resolve();
                    document.head.append(scriptDexie);
                }),
                new Promise(resolve => {
                    const scriptAddon = document.createElement('script');
                    scriptAddon.src = '/base/dist/dexie-encrypted-addon.min.js';
                    scriptAddon.type = 'text/javascript';
                    scriptAddon.onload = () => resolve();
                    document.head.append(scriptAddon);
                })
            ]);
        });
        it('should load Dexie.js', () => {
            expect((window as any).Dexie).toBeTruthy();
        });
        it('should load DexieEncryptionAddon.js', () => {
            expect((window as any).DexieEncryptionAddon).toBeTruthy();
            expect((window as any).DexieEncryptionAddon.encrypted).toBeTruthy();
            expect((window as any).DexieEncryptionAddon.Encryption).toBeTruthy();
        });
    });
});
