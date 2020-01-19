// tslint:disable: space-before-function-paren // Conflict with default formatter vscode
import Dexie from 'dexie';
import { cloneDeep } from 'lodash';

type DexieExtended = Dexie & {
    pVermeerAddonsRegistered?: { [addon: string]: boolean }
};

export function immutable(db: Dexie) {

    // Register addon
    const dbExtended: DexieExtended = db;
    dbExtended.pVermeerAddonsRegistered = {
        ...dbExtended.pVermeerAddonsRegistered,
        immutable: true
    };

    // =============== Add =================
    db.Table.prototype.add = Dexie.override(
        db.Table.prototype.add,
        (origFunc: Dexie.Table<any, any>['add']) =>

            function (this: any, item, key?) {
                const itemState = cloneDeep(item);
                const keyState = cloneDeep(key);
                return origFunc.call(this, itemState, keyState);
            } as typeof origFunc
    );

    db.Table.prototype.bulkAdd = Dexie.override(
        db.Table.prototype.bulkAdd,
        (origFunc: Dexie.Table<any, any>['bulkAdd']) =>

            function (this: any, item, key?) {
                const itemState = cloneDeep(item);
                const keyState = cloneDeep(key);
                return origFunc.call(this, itemState, keyState);
            } as typeof origFunc
    );
    // =============== Put =================
    db.Table.prototype.put = Dexie.override(
        db.Table.prototype.put,
        (origFunc: Dexie.Table<any, any>['put']) =>

            function (this: any, item, key?) {
                const itemState = cloneDeep(item);
                const keyState = cloneDeep(key);
                return origFunc.call(this, itemState, keyState);
            } as typeof origFunc
    );

    db.Table.prototype.bulkPut = Dexie.override(
        db.Table.prototype.bulkPut,
        (origFunc: Dexie.Table<any, any>['bulkPut']) =>

            function (this: any, item, key?) {
                const itemState = cloneDeep(item);
                const keyState = cloneDeep(key);
                return origFunc.call(this, itemState, keyState);
            } as typeof origFunc
    );
    // =============== Update =================
    db.Table.prototype.update = Dexie.override(
        db.Table.prototype.update,
        (origFunc: Dexie.Table<any, any>['update']) =>

            function (this: any, key, item) {
                const keyState = cloneDeep(key);
                const itemState = cloneDeep(item);
                return origFunc.call(this, keyState, itemState);
            } as typeof origFunc
    );
}
