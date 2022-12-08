var DrawingNameMapper = (function () {
    function DrawingNameMapper() {
    }
    DrawingNameMapper.getDrawingName = function (className) {
        switch (className) {
            case 'lineSegment':
                return 'خط الاتجاه';
            case 'trendChannel':
                return 'قناة خط الاتجاه';
            case 'horizontalLine':
                return 'خط أفقي';
            case 'verticalLine':
                return 'خط عمودي';
            case 'circle':
                return 'دائرة';
            case 'ellipse':
                return 'شكل بيضوي';
            case 'rectangle':
                return 'مستطيل';
            case 'band':
                return 'مدى';
            case 'triangle':
                return 'مثلث';
            case 'fibonacciRetracements':
                return 'ارتداد فيبوناتشي';
            case 'fibonacciProjection':
                return 'اسقاط فيبوناتشي';
            case 'fibonacciExtensions':
                return 'امتداد فيبوناتشي';
            case 'fibonacciEllipses':
                return 'دائرة فيبوناتشي';
            case 'fibonacciFan':
                return 'مروحة فيبوناتشي';
            case 'fibonacciTimeZones':
                return 'فترات فيبوناتشي';
            case 'andrewsPitchfork':
                return 'تشعب بيتش';
            case 'gannFan':
                return 'مروخة غان';
            case 'grid':
                return 'شبكة';
            case 'tironeLevels':
                return 'مستويات تايرون';
            case 'quadrantLines':
                return 'الخطوط الربعية';
            case 'errorChannel':
                return 'قناة معيارية';
            case 'raffRegression':
                return 'انحسار راف';
            case 'text':
                return 'نص';
            case 'image':
                return 'صورة';
            case 'arrowUp':
                return 'سهم إلى أعلى';
            case 'arrowDown':
                return 'سهم إلى أسفل';
            case 'arrowLeft':
                return 'سهم إلى اليسار';
            case 'arrowRight':
                return 'سهم إلى اليمين';
            case 'oneOpenEndLineSegment':
                return 'خط مفتوح الطرف';
            case 'twoOpenEndLineSegment':
                return 'خط مفتوح الطرفين';
            case 'arrowLineSegment':
                return 'خط الاتجاه مع سهم';
            case 'angleLineSegment':
                return 'خط الاتجاه مع زاوية';
            case 'horizontalRay':
                return 'شعاع أفقي';
            case 'parallelChannel':
                return 'قناة متساوية';
            case 'crossLine':
                return 'خط التقاطع';
            case 'rotatedRectangle':
                return 'مستطيل مستدير';
            case 'disjointAngle':
                return 'زاويه منفصله';
            case 'trianglePattern':
                return 'نمط المثلث';
            case 'abcdPattern':
                return 'نمط ABCD';
            case 'threeDrivesPattern':
                return 'نمط المحركات الثلاث';
            case 'xabcdPattern':
                return 'نمط XABCD';
            case 'cypherPattern':
                return 'نمط سايفر';
            case 'headAndShoulders':
                return 'الرأس والكتفين';
            case 'elliottDoubleComboWave':
                return 'موجات اليوت (WXY)';
            case 'elliottCorrectionWave':
                return 'موجات اليوت (ABC)';
            case 'elliottImpulseWave':
                return 'موجات اليوت (12345)';
            case 'elliottTriangleWave':
                return 'موجات اليوت (ABCDE)';
            case 'elliottTripleComboWave':
                return 'موجات اليوت (WXYXZ)';
            case 'polyLine':
                return 'متعدد الخطوط';
            case 'arc':
                return 'قوس';
            case 'curve':
                return 'منحنى';
            case 'flatTopBottom':
                return 'قناة مسطحة';
            case 'flag':
                return 'علم';
            case 'priceLabel':
                return 'ايقونة السعر';
            case 'note':
                return 'ملاحظة';
            case 'callout':
                return 'نص بيضوي';
            case 'balloon':
                return 'نص بالون';
            case 'noteAnchored':
                return 'ملاحظة ثابته';
            case 'textAnchored':
                return 'نص ثابته';
            case 'timeCycles':
                return 'فترات زمنيه';
            case 'cyclicLines':
                return 'خطوط دورية';
            case 'fibonacciSpeedResistanceFan':
                return 'فيبوناتشي مروحة مقاومة للسرعة';
            case 'fibonacciSpeedResistanceArcs':
                return 'فيبوناتشي دائرة مقاومة للسرعة';
            case 'gannBox':
                return 'صندوق غان';
            case 'gannSquare':
                return 'مربع غان';
            case 'gannSquareFixed':
                return 'مربع غان الثابت';
            case 'brush':
                return 'الفرشاة';
            case 'volumeProfiler':
                return 'محلل الحجم';
            case 'priceCalculation':
                return 'حساب السعر';
            default:
                return 'رسم فني';
        }
    };
    return DrawingNameMapper;
}());
export { DrawingNameMapper };
//# sourceMappingURL=DrawingNameMapper.js.map