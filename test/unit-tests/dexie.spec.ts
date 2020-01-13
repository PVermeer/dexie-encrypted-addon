import { databasesPositive } from '../mocks/mocks';

describe('Dexie', () => {
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
