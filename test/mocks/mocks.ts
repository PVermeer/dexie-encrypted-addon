import Dexie from 'dexie';
import faker from 'faker/locale/en';
import { encrypted } from '../../src/encrypted';
import { Encryption } from '../../src/encryption.class';

export interface Friend {
    id?: string;
    testProp?: string;
    hasAge?: boolean;
    firstName: string;
    lastName: string;
    shoeSize: number;
}

class TestDatabase extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string, secret?: string) {
        super(name);
        encrypted(this, { secretKey: secret });
        this.version(1).stores({
            friends: '++#id, firstName, $lastName, $shoeSize, age',
            buddies: '++id, buddyName, buddyAge',
            dudes: '++id, $dudeName, $dudeAge',
            empty: ''
        });
    }
}
class TestDatabaseAddons extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string, secret: string) {
        super(name, {
            addons: [encrypted.setOptions({ secretKey: secret })]
        });
        this.version(1).stores({
            friends: '++#id, firstName, $lastName, $shoeSize, age',
        });
    }
}
class TestDatabaseAddonsNoSecret extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name, {
            addons: [encrypted]
        });
        this.version(1).stores({
            friends: '++#id, firstName, $lastName, $shoeSize, age',
        });
    }
}
class TestDatabaseNoEncryptedKeys extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        encrypted(this);
        this.version(1).stores({
            friends: '++#id, firstName, lastName, shoeSize, age',
        });
    }
}
class TestDatabaseNoHashPrimary extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        encrypted(this);
        this.version(1).stores({
            friends: '++id, firstName, lastName, shoeSize, age',
        });
    }
}
class TestDatabaseNoIndexes extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        encrypted(this);
        this.version(1).stores({
            friends: '',
        });
    }
}
function testDatabaseJs(): TestDatabase {
    const db = new Dexie('TestDatabaseJs', {
        addons: [encrypted]
    });
    db.version(1).stores({
        friends: '++#id, firstName, $lastName, $shoeSize, age',
        buddies: '++id, buddyName, buddyAge',
        dudes: '++id, $dudeName, $dudeAge',
        empty: ''
    });
    return db as TestDatabase;
}
function testDatabaseJsWithSecret(): TestDatabase {
    const secret = Encryption.createRandomEncryptionKey();
    const db = new Dexie('TestDatabaseJs', {
        addons: [encrypted.setOptions({ secretKey: secret })]
    });
    db.version(1).stores({
        friends: '++#id, firstName, $lastName, $shoeSize, age',
        buddies: '++id, buddyName, buddyAge',
        dudes: '++id, $dudeName, $dudeAge',
        empty: ''
    });
    return db as TestDatabase;
}

export const databasesPositive = [
    {
        desc: 'TestDatabase',
        db: () => new TestDatabase('TestDatabase')
    },
    {
        desc: 'TestDatabaseNoEncryptedKeys',
        db: () => new TestDatabaseNoEncryptedKeys('TestDatabaseNoEncryptedKeys')
    },
    {
        desc: 'TestDatabaseAddons',
        db: () => new TestDatabaseAddons('TestDatabaseAddons', Encryption.createRandomEncryptionKey())
    },
    {
        desc: 'TestDatabaseAddons',
        db: () => new TestDatabaseAddonsNoSecret('TestDatabaseAddons')
    },
    {
        desc: 'testDatabaseJs',
        db: () => testDatabaseJs()
    },
    {
        desc: 'testDatabaseJsWithSecret',
        db: () => testDatabaseJsWithSecret()
    }
];
export const databasesNegative = [
    {
        desc: 'TestDatabaseNoHashPrimary',
        db: () => new TestDatabaseNoHashPrimary('TestDatabaseNoHashPrimary')
    },
    {
        desc: 'TestDatabaseNoIndexesNoHash',
        db: () => new TestDatabaseNoIndexes('TestDatabaseNoIndexesNoHash')
    }
];

export class TestDatabaseNotImmutable extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string) {
        super(name);
        encrypted(this, { immutable: false });
        this.version(1).stores({
            friends: '++#id, firstName, $lastName, $shoeSize, age',
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
