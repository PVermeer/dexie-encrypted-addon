import { StoreSchemas } from './encrypt';

export interface ModifiedKeys {
    [prop: string]: {
        keys: string[];
        hashPrimary: boolean
    };
}

export class SchemaParser {

    private schema: StoreSchemas;

    constructor(schema: StoreSchemas) {
        this.schema = schema;
    }

    /**
     * Extract the to be encrypted keys from the schema.
     */
    public getEncryptedKeys(): ModifiedKeys {
        return Object.entries(this.schema).reduce<ModifiedKeys>((acc, [table, value]) => {
            if (!value) { return acc; }
            if (acc[table]) { throw new Error('Duplicate table found'); }

            const values = value.split(',').map(x => x.trim());
            const toBeEncryptedKeys = values
                .filter(x => x.startsWith('$'))
                .map(x => x.replace('$', ''));

            const primaryKey = values[0];
            const hashPrimary = primaryKey.includes('#');

            if (!toBeEncryptedKeys.length && !hashPrimary) { return acc; }

            return {
                ...acc, [table]: {
                    keys: toBeEncryptedKeys,
                    hashPrimary
                }
            };
        }, {});
    }

    /**
     * Create a clean schema without the added keys.
     */
    public getCleanedSchema(): StoreSchemas {
        return Object.entries(this.schema).reduce<StoreSchemas>((acc, [table, value]) => {
            if (!value) { return acc; }
            if (acc[table]) { throw new Error('Duplicate table found'); }

            const values = value.split(',').map(x => x.trim());
            values[0] = values[0].replace('#', '');
            const filteredKeyString = values.filter(x => !x.startsWith('$')).join(',');

            return { ...acc, [table]: filteredKeyString };
        }, {});
    }

}
