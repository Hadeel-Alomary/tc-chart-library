export class AlertDrawingsDefaultSettings {

    public static getChartAlertDrawingTheme(className: string): AlertDrawingTheme {
        switch (className) {
            case 'chartAlert':
                return {
                    line: {
                        strokeColor: '#e55456',
                        width: 1,
                        lineStyle: 'solid'
                    },
                    bridge: {
                        strokeColor: '#e55456',
                        width: 3,
                        lineStyle: 'solid'
                    },
                    dashedLine: {
                        strokeColor: '#e55456',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    valueMarkerFill: {
                        fillColor: '#e55456'
                    },
                    valueMarketText: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'white',
                    }
                };
        }
    }
}

export interface AlertDrawingTheme {
    line: {
        strokeColor: string,
        width: number,
        lineStyle: 'solid' | 'dash'
    },
    bridge: {
        strokeColor: string,
        width: number,
        lineStyle: string
    },
    dashedLine: {
        strokeColor: string,
        width: number,
        lineStyle: string
    },
    valueMarkerFill: {
        fillColor: string
    },
    valueMarketText: {
        fontFamily: string,
        fontSize: number,
        fillColor: string
    }
}
