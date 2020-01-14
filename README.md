Dexie Encryption Plugin
======

[![Build Status](https://travis-ci.org/PVermeer/dexie-encryption-addon.svg?branch=master)](https://travis-ci.org/PVermeer/dexie-encryption-addon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Install over npm
----------------
```
npm install TODO
```

Encrypt your data the Dexie way!

Plugin is written to be as easy to use as Dexie.js itself.
Using $ on your keys will encrypt this key.
Using # on the first key will hash this key with the document on creation.
This will create an unique primary key based on the document itself.

#### Added Schema Syntax
Symbol | Description
----- | ------
$ | Encrypt this value
\# | Only as first key: Hash input document and index the hash

#### Example (ES2016 / ES7)
```js
import Dexie from 'dexie';
import { dexie-encrypted } from 'TODO';
import { Encryption } from 'TODO';

// Generate a random key
const secret = Encryption.createRandomEncryptionKey();

// Declare Database
const db = new Dexie("FriendDatabase", {
    addons: [dexie-encrypted.setOptions({ secretKey: secret })]
});
db.version(1).stores({ friends: "#id, $name, $shoeSize, age" });

// Wait for open
db.open().then(() => {
// Use Dexie
});
```

#### Example (Typescript)
```js
import Dexie from 'dexie';
import { dexie-encrypted } from 'TODO';
import { Encryption } from 'TODO';

interface Friend {
    id?: number;
    name?: string;
    shoeSize?: number;
    age?: number;
}

// Generate a random key
const secret = Encryption.createRandomEncryptionKey();

// Declare Database
class FriendsDatabase extends Dexie {
    public friends: Dexie.Table<Friend, string>;
    constructor(name: string, secret?: string) {
        super(name);
        dexie-encrypted(this, { secretKey: secret });
        this.version(1).stores({
            friends: '#id, $name, $shoeSize, age'
        });
    }
}

const db = new FriendDatabase('FriendsDatabase', secret);

// Wait for open
db.open().then(() => {
// Use Dexie
});

```
API
---

The packet exposes two exports:

#### dexie-encrypted - addon
```ts
/**
 * @secretKey Your previously saved secret.
 * @immutable Set to false to disable immutable state on document creation and updates.
 */
interface EncryptedOptions {
    secretKey?: string;
    immutable?: boolean;
}
/** 
 * @method setOptions(string) Set options and return the addon.
 * @param options Set secret key and / or immutable create methods.
 * @returns The secret key (provided or generated)
 */ 
function encrypted(db: Dexie, options?: EncryptedOptions): string;
/**
 * Namespace to set options and return the addon function when used in (ES2016 / ES7)
 */ 
namespace encrypted {
    function setOptions(options: EncryptedOptions): string;
}
```

#### Encryption - class
```ts
/**
 * Class with cryptic methods
 */
class Encryption {
    readonly secret: string;
    readonly secretUint8Array: Uint8Array;
    /**
     * Create a random key.
     */
    static createRandomEncryptionKey(): string;
    /**
     * Create a base64 hash string of the provided input.
     * @param input Any non-circulair value.
     */
    static hash(input: any): string;
    /**
     * Encrypt any value.
     * @param json Any non-circulair value.
     * @param key Secret key to encrypt with.
     */
    constructor(secret?: string);
}
```
---------------------------------------------------

Dexie.js
========

Dexie.js is a wrapper library for indexedDB - the standard database in the browser. http://dexie.org


