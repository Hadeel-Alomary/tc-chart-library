export interface IStringPaddingOptions {
    width: number;
    alignLeft: boolean;
    padding: number;
}
export declare class JsUtil {
    static isNumber(value: unknown): boolean;
    static isFiniteNumber(value: unknown): boolean;
    static isFiniteNumberOrNaN(value: unknown): boolean;
    static isPositiveNumber(value: unknown): boolean;
    static isNegativeNumber(value: unknown): boolean;
    static isPositiveNumberOrNaN(value: unknown): boolean;
    static isFunction(value: Object): boolean;
    static clone<T extends Object>(obj: T): T;
    static extend(dst: ObjectConstructor, src: ObjectConstructor): void;
    static applyMixins(derivedCtor: Object, baseCtors: Object[]): void;
    static padStr(str: string, options: IStringPaddingOptions): string;
    static filterText(text: string): string;
    static guid(): string;
}
//# sourceMappingURL=JsUtil.d.ts.map