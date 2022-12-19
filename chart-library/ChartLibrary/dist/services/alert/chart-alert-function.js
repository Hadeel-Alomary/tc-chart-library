import { Tc } from '../../utils';
var ChartAlertFunction = (function () {
    function ChartAlertFunction(type, arabic, english, arabicMessageTemplate, englishMessageTemplate, technicalFunction) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
        this.arabicMessageTemplate = arabicMessageTemplate;
        this.englishMessageTemplate = englishMessageTemplate;
        this.technicalFunction = technicalFunction;
    }
    ChartAlertFunction.getAllFunctions = function () {
        if (ChartAlertFunction.allFunctions.length == 0) {
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.CROSS, 'تقاطع', 'Cross', ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.CROSS), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.CROSS), TechnicalFunctions.CROSS));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.CROSS_UP, 'تقاطع للأعلى', 'Cross up', ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.CROSS_UP), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.CROSS_UP), TechnicalFunctions.CROSS_UP));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.CROSS_DOWN, 'تقاطع للأسفل', 'Cross down', ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.CROSS_DOWN), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.CROSS_DOWN), TechnicalFunctions.CROSS_DOWN));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.ENTERING_CHANNEL, 'دخول قناة', 'Entering channel', ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.ENTERING_CHANNEL), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.ENTERING_CHANNEL), TechnicalFunctions.ENTERING_CHANNEL));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.EXITING_CHANNEL, 'خروج قناة', 'Exiting channel', ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.EXITING_CHANNEL), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.EXITING_CHANNEL), TechnicalFunctions.EXITING_CHANNEL));
        }
        return ChartAlertFunction.allFunctions;
    };
    ChartAlertFunction.fromType = function (type) {
        var result = ChartAlertFunction.getAllFunctions().find(function (alertFunction) { return alertFunction.type == type; });
        Tc.assert(result != null, 'Unsupported Chart Alert Function Type: ' + type);
        return result;
    };
    ChartAlertFunction.getArabicMessage = function (technicalFunctionType) {
        switch (technicalFunctionType) {
            case ChartAlertFunctionType.CROSS:
                return 'INDICATOR يتقاطع مع قيمة VALUE1';
            case ChartAlertFunctionType.CROSS_UP:
                return 'INDICATOR يتقاطع لأعلى مع قيمة VALUE1';
            case ChartAlertFunctionType.CROSS_DOWN:
                return 'INDICATOR يتقاطع لأسفل مع قيمة VALUE1';
            case ChartAlertFunctionType.ENTERING_CHANNEL:
                return 'INDICATOR يدخل إلى قناة تتراوح من VALUE2 إلى VALUE1';
            case ChartAlertFunctionType.EXITING_CHANNEL:
                return 'INDICATOR يخرج من قناة تتراوح من VALUE2 إلى VALUE1';
        }
        Tc.error("should never be here");
    };
    ChartAlertFunction.getEnglishMessage = function (technicalFunctionType) {
        switch (technicalFunctionType) {
            case ChartAlertFunctionType.CROSS:
                return 'INDICATOR crosses value VALUE1';
            case ChartAlertFunctionType.CROSS_DOWN:
                return 'INDICATOR crosses up value VALUE1';
            case ChartAlertFunctionType.CROSS_UP:
                return 'INDICATOR crosses down value VALUE1';
            case ChartAlertFunctionType.ENTERING_CHANNEL:
                return 'INDICATOR enters channel that ranges from VALUE1 to VALUE2';
            case ChartAlertFunctionType.EXITING_CHANNEL:
                return 'INDICATOR exits channel that ranges from VALUE1 to VALUE2';
        }
        Tc.error("should never be here");
    };
    ChartAlertFunction.allFunctions = [];
    return ChartAlertFunction;
}());
export { ChartAlertFunction };
export var ChartAlertFunctionType;
(function (ChartAlertFunctionType) {
    ChartAlertFunctionType[ChartAlertFunctionType["CROSS"] = 1] = "CROSS";
    ChartAlertFunctionType[ChartAlertFunctionType["CROSS_UP"] = 2] = "CROSS_UP";
    ChartAlertFunctionType[ChartAlertFunctionType["CROSS_DOWN"] = 3] = "CROSS_DOWN";
    ChartAlertFunctionType[ChartAlertFunctionType["ENTERING_CHANNEL"] = 4] = "ENTERING_CHANNEL";
    ChartAlertFunctionType[ChartAlertFunctionType["EXITING_CHANNEL"] = 5] = "EXITING_CHANNEL";
})(ChartAlertFunctionType || (ChartAlertFunctionType = {}));
var TechnicalFunctions = (function () {
    function TechnicalFunctions() {
    }
    TechnicalFunctions.CROSS = "((( P_1 > P_2 ) and (( P_1_prv1 < P_2_prv1 ) or (( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 < P_2_prv2 )))) or (( P_1 < P_2 ) and (( P_1_prv1 > P_2_prv1 ) or (( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 > P_2_prv2 )))))";
    TechnicalFunctions.CROSS_UP = "((( P_1 > P_2 ) and ( P_1_prv1 < P_2_prv1 )) or (( P_1 > P_2 ) and ( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 < P_2_prv2 )))";
    TechnicalFunctions.CROSS_DOWN = "((( P_1 < P_2 ) and ( P_1_prv1 > P_2_prv1 )) or (( P_1 < P_2 ) and ( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 > P_2_prv2 )))";
    TechnicalFunctions.ENTERING_CHANNEL = "(((P_1 < P_2) and (P_1 > P_3)) and ((( P_1_prv1 > P_2_prv1 ) or ( P_1_prv1 < P_3_prv1 ) ) or (( ( P_1_prv1 = P_2_prv1 ) or ( P_1_prv1 = P_3_prv1 ) ) and ( ( P_1_prv2 > P_2_prv2 ) or ( P_1_prv2 < P_3_prv2 )))))";
    TechnicalFunctions.EXITING_CHANNEL = "(((P_1 > P_2) or (P_1 < P_3)) and ((( P_1_prv1 < P_2_prv1 ) and ( P_1_prv1 > P_3_prv1 ) ) or (( ( P_1_prv1 = P_2_prv1 ) or ( P_1_prv1 = P_3_prv1 ) ) and ( ( P_1_prv2 < P_2_prv2 ) and ( P_1_prv2 > P_3_prv2 ))) ))";
    return TechnicalFunctions;
}());
//# sourceMappingURL=chart-alert-function.js.map