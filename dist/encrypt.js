import { __read } from "tslib";
import { Dexie } from 'dexie';
import { Encryption } from './encryption.class';
import { SchemaParser } from './schema-parser';
export function encryptify(db, secretKey) {
    var encryptSchema;
    var encryption = new Encryption(secretKey);
    // Get the encryption keys from the schema and return the function with a clean schema.
    db.Version.prototype._parseStoresSpec = Dexie.override(db.Version.prototype._parseStoresSpec, function (parseStoresSpec) { return function (storesSpec, outSchema) {
        var parser = new SchemaParser(storesSpec);
        var encryptedKeys = parser.getEncryptedKeys();
        var cleanedSchema = parser.getCleanedSchema();
        encryptSchema = encryptedKeys;
        // Return the original function with cleaned schema.
        return parseStoresSpec.call(cleanedSchema, outSchema);
    }; });
    if (!encryptSchema || !Object.keys(encryptSchema).length) {
        throw new Error('No encryption keys are set');
    }
    // Set encryption on the tables via the create and update hook.
    Object.entries(encryptSchema).forEach(function (_a) {
        var _b = __read(_a, 2), table = _b[0], keysObj = _b[1];
        var dexieTable = db.table(table);
        dexieTable.hook('creating', function (_primaryKey, document) {
            keysObj.keys.forEach(function (key) {
                if (document[key]) {
                    document[key] = encryption.encrypt(document[key]);
                }
            });
            // Hash the encrypted document to the primary key so it can still be compared for uniqness.
            if (keysObj.hashPrimary) {
                var primaryKey = keysObj.keys[0];
                document[primaryKey] = encryption.hash(document);
            }
        });
        dexieTable.hook('updating', function (_primaryKey, document) {
            keysObj.keys.forEach(function (key) {
                if (document[key]) {
                    document[key] = encryption.encrypt(document[key]);
                }
            });
        });
    });
    // Set decryption on the tables via the read hook.
    Object.entries(encryptSchema).forEach(function (_a) {
        var _b = __read(_a, 2), table = _b[0], keysObj = _b[1];
        var dexieTable = db.table(table);
        dexieTable.hook('reading', function (document) {
            keysObj.keys.forEach(function (key) {
                if (document[key]) {
                    document[key] = encryption.decrypt(document[key]);
                }
            });
        });
    });
    return encryption.secret;
}
//# sourceMappingURL=encrypt.js.map