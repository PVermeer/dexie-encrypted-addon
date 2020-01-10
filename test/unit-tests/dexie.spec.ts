import { Database, mockFriends } from '../mocks/mocks';
import { Encryption } from '../../src/encryption.class';

describe('Dexie', () => {
    it('should create database', async () => {
        const db = new Database();
        expect(db).toBeTruthy();
        await db.delete();
    });
    describe('Encryption', () => {
        let db: Database;
        beforeEach(async () => {
            db = new Database();
            await db.open();
            expect(db.isOpen()).toBeTrue();
        });
        afterEach(async () => {
            await db.delete();
        });
        it('should be able to add friends', async () => {
            const [friend] = mockFriends(1);
            await db.friends.add(friend);
            const hashedId = Encryption.hash(friend);

            const getFriend = await db.friends.get(hashedId);
            expect(getFriend).toEqual({ ...friend, id: hashedId });
        });
        it('should be able to add multiple friends', async () => {
            const friends = mockFriends(1);
            await db.friends.bulkAdd(friends);
            // const hashedId = Encryption.hash(friends[0]);

            // const getFriend = await db.friends.get(hashedId);
            // expect(getFriend).toEqual({ ...friends[0], id: hashedId });
        });
    });
});

