var AlertDrawingsDefaultSettings = (function () {
    function AlertDrawingsDefaultSettings() {
    }
    AlertDrawingsDefaultSettings.getChartAlertDrawingTheme = function (className) {
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
    };
    return AlertDrawingsDefaultSettings;
}());
export { AlertDrawingsDefaultSettings };
//# sourceMappingURL=AlertDrawingsDefaultSettings.js.map