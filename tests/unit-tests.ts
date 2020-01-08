import { Database, mockFriends } from './mocks';
import { Encryption } from '../src/encryption.class';

describe('Dexie', () => {
    it('should create database', () => {
        const db = new Database();
        expect(db).toBeTruthy();
    });
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
    fit('should be able to add friends', async () => {
        const [friend] = mockFriends(1);
        await db.friends.add(friend);
        const hashedId = Encryption.hash(friend);

        const getFriend = await db.friends.get(hashedId);
        console.log(getFriend);
        expect(getFriend).toEqual({ ...friend, id: hashedId});
    });
});

