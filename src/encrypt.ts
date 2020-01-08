// tslint:disable: space-before-function-paren // Conflict with default formatter vscode
import Dexie from 'dexie';
import { DbSchema } from '../node_modules/dexie_master/src/public/types/db-schema';
import { Encryption } from './encryption.class';
import { ModifiedKeys, SchemaParser } from './schema-parser';

export interface StoreSchemas { [tableName: string]: string | null; }

export function encryptify(db: Dexie, secretKey?: string) {

    let encryptSchema: ModifiedKeys | undefined;
    const encryption = new Encryption(secretKey);

    // Get the encryption keys from the schema and return the function with a clean schema.
    db.Version.prototype._parseStoresSpec = Dexie.override(
        db.Version.prototype._parseStoresSpec,
        (origFunc) =>

            function (this: any, storesSpec: StoreSchemas, outSchema: DbSchema) {
                const parser = new SchemaParser(storesSpec);
                const encryptedKeys = parser.getEncryptedKeys();
                const cleanedSchema = parser.getCleanedSchema();

                encryptSchema = encryptedKeys;

                // Return the original function with cleaned schema.
                return origFunc.apply(this, [cleanedSchema, outSchema]);
            });

    db.on('ready', () => {

        if (!encryptSchema || !Object.keys(encryptSchema).length) {
            throw new Error('No encryption keys are set');
        }

        // Set encryption on the tables via the create and update hook.
        Object.entries(encryptSchema).forEach(([table, keysObj]) => {
            const dexieTable = db.table(table);

            dexieTable.hook('creating', (primaryKey, document) => {

                // Hash the document to the primary key so it can still be compared for uniqness.
                let hashedPrimKey: string | undefined;
                let documentPrimKey: string | undefined;
                if (keysObj.hashPrimary && primaryKey) {
                    const entry = Object.entries(document).find(([_key, value]) => value === primaryKey);
                    if (!entry) { throw new Error('Could not find the document key of the primary key'); }

                    documentPrimKey = entry[0];
                    hashedPrimKey = Encryption.hash(document);
                    document[documentPrimKey] = hashedPrimKey;
                }

                // Encrypted the selected keys
                keysObj.keys.forEach(key => {
                    if (document[key]) { document[key] = encryption.encrypt(document[key]); }
                });
            });

            dexieTable.hook('updating', (_primaryKey, document) => {
                keysObj.keys.forEach(key => {
                    if (document[key]) { document[key] = encryption.encrypt(document[key]); }
                });
            });

        });

        // Set decryption on the tables via the read hook.
        Object.entries(encryptSchema).forEach(([table, keysObj]) => {
            const dexieTable = db.table(table);

            dexieTable.hook('reading', document => {
                if (!document) { return; }
                keysObj.keys.forEach(key => {
                    if (document[key]) { document[key] = encryption.decrypt(document[key]); }
                });
                return document;
            });
        });
    });

    return encryption.secret;
}
