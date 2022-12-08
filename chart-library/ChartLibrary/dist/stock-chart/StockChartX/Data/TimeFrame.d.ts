export declare const TimeSpan: {
    MILLISECONDS_IN_YEAR: number;
    MILLISECONDS_IN_MONTH: number;
    MILLISECONDS_IN_WEEK: number;
    MILLISECONDS_IN_DAY: number;
    MILLISECONDS_IN_HOUR: number;
    MILLISECONDS_IN_MINUTE: number;
    MILLISECONDS_IN_SECOND: number;
};
export declare const Periodicity: {
    [key: string]: string;
};
export declare class TimeFrame {
    periodicity: string;
    interval: number;
    constructor(periodicity?: string, interval?: number);
    toString(): string;
    static periodicityToString(periodicity: string): string;
    static timeIntervalToTimeFrame(timeInterval: number): TimeFrame;
}
//# sourceMappingURL=TimeFrame.d.ts.map