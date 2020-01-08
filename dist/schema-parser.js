import { __assign, __read } from "tslib";
var SchemaParser = /** @class */ (function () {
    function SchemaParser(schema) {
        this.schema = schema;
    }
    /**
     * Extract the to be encrypted keys from the schema.
     */
    SchemaParser.prototype.getEncryptedKeys = function () {
        return Object.entries(this.schema).reduce(function (acc, _a) {
            var _b;
            var _c = __read(_a, 2), table = _c[0], value = _c[1];
            if (!value) {
                return acc;
            }
            if (acc[table]) {
                throw new Error('Duplicate table found');
            }
            var values = value.split(',').map(function (x) { return x.trim(); });
            var toBeEncryptedKeys = values.filter(function (x) { return x.startsWith('$'); });
            var primaryKey = values[0];
            var hashPrimary = primaryKey.includes('#');
            if (!toBeEncryptedKeys.length && !hashPrimary) {
                return acc;
            }
            return __assign(__assign({}, acc), (_b = {}, _b[table] = {
                keys: toBeEncryptedKeys,
                hashPrimary: hashPrimary
            }, _b));
        }, {});
    };
    /**
     * Create a clean schema without the added keys.
     */
    SchemaParser.prototype.getCleanedSchema = function () {
        return Object.entries(this.schema).reduce(function (acc, _a) {
            var _b;
            var _c = __read(_a, 2), table = _c[0], value = _c[1];
            if (!value) {
                return acc;
            }
            if (acc[table]) {
                throw new Error('Duplicate table found');
            }
            var values = value.split(',').map(function (x) { return x.trim(); });
            values[0] = values[0].replace('#', '');
            var filteredKeyString = values.filter(function (x) { return !x.startsWith('$'); }).join(',');
            return __assign(__assign({}, acc), (_b = {}, _b[table] = filteredKeyString, _b));
        }, {});
    };
    return SchemaParser;
}());
export { SchemaParser };
//# sourceMappingURL=schema-parser.js.map