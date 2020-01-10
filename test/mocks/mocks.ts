import Dexie from 'dexie';
import faker from 'faker/locale/en';
import { encryptify } from '../../src/encryptify';
import { immutable } from '../../src/immutable';

interface Friend {
    id: string;
    firstName: string;
    lastName: string;
    shoeSize: number;
}

export class Database extends Dexie {

    public friends: Dexie.Table<Friend, string>;

    constructor() {
        super('Database');
        immutable(this);
        encryptify(this);
        this.version(1).stores({
            friends: '#id, firstName, $lastName, $shoeSize',
            // friends: 'id, firstName, lastName, shoeSize', // TODO write test
        });
    }
}

export const mockFriends = (count: number = 5): Friend[] => {
    const friend = () => ({
        id: 'mock-id: ' + faker.random.alphaNumeric(40),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        shoeSize: faker.random.number({ min: 5, max: 12 })
    });
    return new Array(count).fill(null).map(() => friend());
};
