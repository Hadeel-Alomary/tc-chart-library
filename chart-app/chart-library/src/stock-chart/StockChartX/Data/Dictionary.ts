/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

export interface IDictionary<TValue> {
    add(key: string, value: TValue): void;

    remove(key: string): boolean;

    length(): number;

    containsKey(key: string): boolean;

    tryGet(key: string): TValue;
}

export class Dictionary<TValue> implements IDictionary<TValue> {
    private _length: number;
    private _list: {[key: string]: TValue};

    constructor(init?: { key: string; value: TValue; }[]) {
        this._length = 0;
        this._list = {};

        if (init != null) {
            for (let pair of init) {
                this.add(pair.key, pair.value);
            }
        }
    }

    public add(key: string, value: TValue): void {
        if (this.containsKey(key))
            throw new Error("Such key already exists");

        this._list[key] = value;
        this._length++;
    }

    public remove(key: string): boolean {
        if (!this.containsKey(key))
            return false;

        delete this._list[key];
        this._length--;

        return true;
    }

    public length(): number {
        return this._length;
    }

    public containsKey(key: string): boolean {
        return typeof this._list[key] !== "undefined";
    }

    public tryGet(key: string): TValue {
        return this.containsKey(key) ? this._list[key] : null;
    }
}
