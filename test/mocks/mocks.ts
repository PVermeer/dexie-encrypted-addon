import Dexie from 'dexie';
import faker from 'faker/locale/en';
import { encryptify } from '../../src/encryptify';
import { immutable } from '../../src/immutable';

export interface Friend {
    id?: string;
    testProp?: string;
    firstName: string;
    lastName: string;
    shoeSize: number;
}

export class TestDatabase extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string, secret?: string) {
        super(name);
        immutable(this);
        encryptify(this, secret);
        this.version(1).stores({
            friends: '++#id, firstName, $lastName, $shoeSize, age',
            buddies: '++id, buddyName, buddyAge',
            dudes: '++id, $dudeName, $dudeAge',
            empty: ''
        });
    }
}
export class TestDatabaseNoEncryptedKeys extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        immutable(this);
        encryptify(this);
        this.version(1).stores({
            friends: '++#id, firstName, lastName, shoeSize, age',
        });
    }
}
export class TestDatabaseNoHashPrimary extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        immutable(this);
        encryptify(this);
        this.version(1).stores({
            friends: '++id, firstName, lastName, shoeSize, age',
        });
    }
}
export class TestDatabaseNoIndexesNoHash extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        immutable(this);
        encryptify(this);
        this.version(1).stores({
            friends: '',
        });
    }
}

export const mockFriends = (count: number = 5): Friend[] => {
    const friend = () => ({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.random.number({ min: 1, max: 80 }),
        shoeSize: faker.random.number({ min: 5, max: 12 })
    });
    return new Array(count).fill(null).map(() => friend());
};
