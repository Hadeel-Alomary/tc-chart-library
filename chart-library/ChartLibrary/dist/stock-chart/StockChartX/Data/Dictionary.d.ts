export interface IDictionary<TValue> {
    add(key: string, value: TValue): void;
    remove(key: string): boolean;
    length(): number;
    containsKey(key: string): boolean;
    tryGet(key: string): TValue;
}
export declare class Dictionary<TValue> implements IDictionary<TValue> {
    private _length;
    private _list;
    constructor(init?: {
        key: string;
        value: TValue;
    }[]);
    add(key: string, value: TValue): void;
    remove(key: string): boolean;
    length(): number;
    containsKey(key: string): boolean;
    tryGet(key: string): TValue;
}
//# sourceMappingURL=Dictionary.d.ts.map