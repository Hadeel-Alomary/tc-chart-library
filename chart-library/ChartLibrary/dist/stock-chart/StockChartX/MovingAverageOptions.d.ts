import { TechnicalIndicator } from '../../components/chart/technical-indicators';
export interface MovingAverageSettings {
    type: TechnicalIndicator;
    period: number;
    arabicName: string;
    englishName: string;
}
export declare class MovingAverageOptions {
    private smas;
    private emas;
    constructor();
    simpleMovingAverageOptions(): MovingAverageSettings[];
    exponentialMovingAverageOptions(): MovingAverageSettings[];
}
//# sourceMappingURL=MovingAverageOptions.d.ts.map