import { Chart } from '../Chart';
export interface IConstructor<T> {
    new (): T;
}
export interface IChartBasedConstructor<T> {
    new (chart: Chart): T;
}
export declare class ClassRegistrar<T> {
    private _constructors;
    get registeredItems(): Object;
    register(className: string, constructor: IConstructor<T>): void;
    resolve(className: string): IConstructor<T>;
    createInstance(className: string): T;
    createChartBasedInstance(className: string, chart: Chart): T;
}
//# sourceMappingURL=ClassRegistrar.d.ts.map