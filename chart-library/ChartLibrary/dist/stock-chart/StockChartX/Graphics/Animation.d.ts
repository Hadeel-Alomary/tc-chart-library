export interface IAnimationFrameCallback {
    (): void;
}
export interface IAnimationConfig {
    context?: Object;
    recurring?: boolean;
    callback?: IAnimationFrameCallback;
}
export declare class Animation {
    private _callback;
    get callback(): IAnimationFrameCallback;
    set callback(value: IAnimationFrameCallback);
    private _isStarted;
    get started(): boolean;
    context: Object;
    private _recurring;
    get recurring(): boolean;
    set recurring(value: boolean);
    constructor(config?: IAnimationConfig);
    start(): boolean;
    stop(): void;
    handleAnimationFrame(): void;
}
//# sourceMappingURL=Animation.d.ts.map