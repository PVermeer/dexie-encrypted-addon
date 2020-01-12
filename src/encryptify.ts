// tslint:disable: space-before-function-paren // Conflict with default formatter vscode
import Dexie from 'dexie';
import { Encryption } from './encryption.class';
import { decryptOnReading, encryptOnCreation, encryptOnUpdating } from './hooks';
import { ModifiedKeysTable, SchemaParser } from './schema-parser';

export interface StoreSchemas { [tableName: string]: string | null; }

export function encryptify(db: Dexie, secretKey?: string) {

    let encryptSchema: ModifiedKeysTable | undefined;
    const encryption = new Encryption(secretKey);

    // Get the encryption keys from the schema and return the function with a clean schema.
    db.Version.prototype._parseStoresSpec = Dexie.override(
        db.Version.prototype._parseStoresSpec,
        (origFunc) =>

            function (this: any, storesSpec: StoreSchemas, outSchema: any) {
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

            dexieTable.hook('creating', (primaryKey, document) =>
                encryptOnCreation(primaryKey, document, keysObj, encryption)
            );

            dexieTable.hook('updating', (changes, _primaryKey) =>
                encryptOnUpdating(changes, _primaryKey, keysObj, encryption)
            );

            dexieTable.hook('reading', document =>
                decryptOnReading(document, keysObj, encryption)
            );
        });

    });

    return encryption.secret;
}
