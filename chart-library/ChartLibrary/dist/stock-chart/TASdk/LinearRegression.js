import { Recordset } from "./Recordset";
import { Field } from "./Field";
var LinearRegression = (function () {
    function LinearRegression() {
    }
    LinearRegression.prototype.regression = function (pSource, iPeriods) {
        var X = 0;
        var Y = [];
        var N = 0;
        var q1 = 0;
        var q2 = 0;
        var q3 = 0;
        var XSum = 0;
        var YSum = 0;
        var XSquaredSum = 0;
        var YSquaredSum = 0;
        var XYSum = 0;
        var dSlope = 0;
        var dIntercept = 0;
        var dForecast = 0;
        var dRSquared = 0;
        var Results = new Recordset();
        var dValue = 0;
        var iPeriod = 0;
        var iPosition = 0;
        var iRecordCount = pSource.recordCount;
        var Field1 = new Field();
        Field1.initialize(iRecordCount, 'Slope');
        var Field2 = new Field();
        Field2.initialize(iRecordCount, 'Intercept');
        var Field3 = new Field();
        Field3.initialize(iRecordCount, 'Forecast');
        var Field4 = new Field();
        Field4.initialize(iRecordCount, 'RSquared');
        var nav = 1;
        for (var iRecord = iPeriods; iRecord < iRecordCount + 1; iRecord++) {
            X = iPeriods;
            Y = new Array(X + 1);
            iPosition = iRecord;
            nav = iRecord - iPeriods + 1;
            for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
                dValue = pSource.value(nav);
                Y[iPeriod] = dValue;
                nav++;
            }
            nav = iPosition;
            XSum = 0;
            YSum = 0;
            XSquaredSum = 0;
            YSquaredSum = 0;
            XYSum = 0;
            for (N = 1; N < X + 1; N++) {
                XSum += N;
                YSum += Y[N];
                XSquaredSum += (N * N);
                YSquaredSum += (Y[N] * Y[N]);
                XYSum += (Y[N] * N);
            }
            N = X;
            q1 = (XYSum - ((XSum * YSum) / N));
            q2 = (XSquaredSum - ((XSum * XSum) / N));
            q3 = (YSquaredSum - ((YSum * YSum) / N));
            dSlope = (q1 / q2);
            dIntercept = (((1 / N) * YSum) - (parseInt((N / 2).toString()) * dSlope));
            dForecast = ((N * dSlope) + dIntercept);
            if (!!(q1 * q1) && !!(q2 * q3)) {
                dRSquared = (q1 * q1) / (q2 * q3);
            }
            if (iRecord > iPeriods) {
                Field1.setValue(iRecord, dSlope);
                Field2.setValue(iRecord, dIntercept);
                Field3.setValue(iRecord, dForecast);
                Field4.setValue(iRecord, dRSquared);
            }
            nav++;
        }
        Results.addField(Field1);
        Results.addField(Field2);
        Results.addField(Field3);
        Results.addField(Field4);
        return Results;
    };
    LinearRegression.prototype.timeSeriesForecast = function (pSource, iPeriods, sAlias) {
        var Results;
        Results = this.regression(pSource, iPeriods);
        Results.renameField('Forecast', sAlias);
        Results.removeField('Slope');
        Results.removeField('Intercept');
        Results.removeField('RSquared');
        return Results;
    };
    return LinearRegression;
}());
export { LinearRegression };
//# sourceMappingURL=LinearRegression.js.map