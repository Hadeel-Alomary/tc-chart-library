import { TechnicalIndicator, TechnicalIndicatorType } from '../../components/chart/technical-indicators';
var MovingAverageOptions = (function () {
    function MovingAverageOptions() {
        this.smas = [];
        this.emas = [];
        var smaIndicator = TechnicalIndicator.fromType(TechnicalIndicatorType.SimpleMovingAverage);
        this.smas.push({ type: smaIndicator, period: 10, arabicName: 'متوسط متحرك بسيط', englishName: 'Simple MA' });
        this.smas.push({ type: smaIndicator, period: 20, arabicName: 'متوسط متحرك بسيط', englishName: 'Simple MA' });
        this.smas.push({ type: smaIndicator, period: 35, arabicName: 'متوسط متحرك بسيط', englishName: 'Simple MA' });
        this.smas.push({ type: smaIndicator, period: 50, arabicName: 'متوسط متحرك بسيط', englishName: 'Simple MA' });
        this.smas.push({ type: smaIndicator, period: 100, arabicName: 'متوسط متحرك بسيط', englishName: 'Simple MA' });
        this.smas.push({ type: smaIndicator, period: 200, arabicName: 'متوسط متحرك بسيط', englishName: 'Simple MA' });
        var emaIndicator = TechnicalIndicator.fromType(TechnicalIndicatorType.ExponentialMovingAverage);
        this.emas.push({ type: emaIndicator, period: 10, arabicName: 'متوسط متحرك أسي', englishName: 'Exponential MA' });
        this.emas.push({ type: emaIndicator, period: 20, arabicName: 'متوسط متحرك أسي', englishName: 'Exponential MA' });
        this.emas.push({ type: emaIndicator, period: 35, arabicName: 'متوسط متحرك أسي', englishName: 'Exponential MA' });
        this.emas.push({ type: emaIndicator, period: 50, arabicName: 'متوسط متحرك أسي', englishName: 'Exponential MA' });
        this.emas.push({ type: emaIndicator, period: 100, arabicName: 'متوسط متحرك أسي', englishName: 'Exponential MA' });
        this.emas.push({ type: emaIndicator, period: 200, arabicName: 'متوسط متحرك أسي', englishName: 'Exponential MA' });
    }
    MovingAverageOptions.prototype.simpleMovingAverageOptions = function () {
        return this.smas;
    };
    MovingAverageOptions.prototype.exponentialMovingAverageOptions = function () {
        return this.emas;
    };
    return MovingAverageOptions;
}());
export { MovingAverageOptions };
//# sourceMappingURL=MovingAverageOptions.js.map