// tslint:disable: space-before-function-paren // Conflict with default formatter vscode
import Dexie from 'dexie';
import { cloneDeep } from 'lodash';

export function immutable(db: Dexie) {

    db.Table.prototype.add = Dexie.override(
        db.Table.prototype.add,
        (origFunc) =>

            function (this: any, item: any, key?: string) {
                const itemState = cloneDeep(item);
                const keyState = cloneDeep(key);
                return origFunc.apply(this, [itemState, keyState]);
            });
}
