
export class VirtualTradingCurrency {

    constructor(
        public arabic: string,
        public english: string,
        public code: string
    ) {}

    private static allCurrencies: {[key: string]: VirtualTradingCurrency} = {
        AED: new VirtualTradingCurrency('درهم إماراتي', 'UAE Dirham', 'AED'),
        JOD: new VirtualTradingCurrency('دينار أردني', 'Jordanian Dinar', 'JOD'),
        KWD: new VirtualTradingCurrency('فلس كويتي', 'Kuwaiti Fils', 'KWD'),
        QAR: new VirtualTradingCurrency('ريال قطري', 'Qatari Riyal', 'QAR'),
        SAR: new VirtualTradingCurrency('ريال سعودي', 'Saudi Riyal', 'SAR'),
        USD: new VirtualTradingCurrency('دولار أميركي', 'US Dollar', 'USD'),
        EGP: new VirtualTradingCurrency('جنيه مصري', 'Egyption Pound', 'EGP'),
    };

    public static fromValue(value: string): VirtualTradingCurrency {
        switch (value) {
            case 'AED':
                return VirtualTradingCurrency.allCurrencies.AED;
            case 'JOD':
                return VirtualTradingCurrency.allCurrencies.JOD;
            case 'KWD':
                return VirtualTradingCurrency.allCurrencies.KWD;
            case 'QAR':
                return VirtualTradingCurrency.allCurrencies.QAR;
            case 'SAR':
                return VirtualTradingCurrency.allCurrencies.SAR;
            case 'USD':
                return VirtualTradingCurrency.allCurrencies.USD;
            case 'EGP':
                return VirtualTradingCurrency.allCurrencies.EGP;
            default:
                return null;
        }
    }

    public static allSupportedCurrencies(): VirtualTradingCurrency[] {
        let result = [];
        for (let key in VirtualTradingCurrency.allCurrencies) {
            result.push(VirtualTradingCurrency.allCurrencies[key])
        }
        return result;
    }

    public static getMarketCurrency(market: string): VirtualTradingCurrency {
        switch (market) {
            case 'DFM':
            case 'ADX':
                return VirtualTradingCurrency.allCurrencies.AED;
            case 'TAD':
                return VirtualTradingCurrency.allCurrencies.SAR;
            case 'KSE':
                return VirtualTradingCurrency.allCurrencies.KWD;
            case 'DSM':
                return VirtualTradingCurrency.allCurrencies.QAR;
            case 'USA':
                return VirtualTradingCurrency.allCurrencies.USD;
            case 'ASE':
                return VirtualTradingCurrency.allCurrencies.JOD;
            case 'EGY':
                return VirtualTradingCurrency.allCurrencies.EGP;
            default:
                return null;
        }
    }
}
