import {TechnicalIndicator} from "../../components/technical-indicator/technical-indicator";
import {TechnicalIndicatorType} from "@src/components/technical-indicator/technical-indicator-type";

export interface MovingAverageSettings {
    type: TechnicalIndicator,
    period: number,
    arabicName:string;
    englishName:string;
}

export class MovingAverageOptions {

    private smas:MovingAverageSettings[] = [];
    private emas:MovingAverageSettings[] = [];

    constructor() {
        let smaIndicator:TechnicalIndicator = TechnicalIndicator.fromType(TechnicalIndicatorType.SimpleMovingAverage);

        this.smas.push({type: smaIndicator, period: 10, arabicName: 'متوسط متحرك بسيط',englishName:'Simple MA'});
        this.smas.push({type: smaIndicator, period: 20, arabicName: 'متوسط متحرك بسيط',englishName:'Simple MA'});
        this.smas.push({type: smaIndicator, period: 35, arabicName: 'متوسط متحرك بسيط',englishName:'Simple MA'});
        this.smas.push({type: smaIndicator, period: 50, arabicName: 'متوسط متحرك بسيط',englishName:'Simple MA'});
        this.smas.push({type: smaIndicator, period: 100, arabicName: 'متوسط متحرك بسيط',englishName:'Simple MA'});
        this.smas.push({type: smaIndicator, period: 200, arabicName: 'متوسط متحرك بسيط',englishName:'Simple MA'});

        let emaIndicator:TechnicalIndicator = TechnicalIndicator.fromType(TechnicalIndicatorType.ExponentialMovingAverage);

        this.emas.push({type: emaIndicator, period: 10, arabicName: 'متوسط متحرك أسي',englishName:'Exponential MA'});
        this.emas.push({type: emaIndicator, period: 20, arabicName: 'متوسط متحرك أسي',englishName:'Exponential MA'});
        this.emas.push({type: emaIndicator, period: 35, arabicName: 'متوسط متحرك أسي',englishName:'Exponential MA'});
        this.emas.push({type: emaIndicator, period: 50, arabicName: 'متوسط متحرك أسي',englishName:'Exponential MA'});
        this.emas.push({type: emaIndicator, period: 100, arabicName: 'متوسط متحرك أسي',englishName:'Exponential MA'});
        this.emas.push({type: emaIndicator, period: 200, arabicName: 'متوسط متحرك أسي',englishName:'Exponential MA'});
    }

    simpleMovingAverageOptions():MovingAverageSettings[] {
        return this.smas;
    }

    exponentialMovingAverageOptions():MovingAverageSettings[] {
        return this.emas;
    }
}
