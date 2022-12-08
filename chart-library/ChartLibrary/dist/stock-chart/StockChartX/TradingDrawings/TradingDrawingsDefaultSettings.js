var TradingDrawingsDefaultSettings = (function () {
    function TradingDrawingsDefaultSettings() {
    }
    TradingDrawingsDefaultSettings.getTradingOrderTheme = function () {
        return {
            Light: {
                buyColors: {
                    solidColor: '#080',
                    opaqueColor: 'rgba(0,128,0,0.7)',
                    highOpacityColor: 'rgba(0,128,0,0.4)'
                },
                sellColors: {
                    solidColor: '#e55456',
                    opaqueColor: 'rgba(255,0,0,0.7)',
                    highOpacityColor: 'rgba(255,0,0,0.4)'
                },
                line: {
                    strokeColor: 'black',
                    width: 1,
                    lineStyle: 'solid'
                },
                dashedLine: {
                    strokeColor: 'black',
                    width: 1,
                    lineStyle: 'dash'
                },
                fill: {
                    fillColor: 'rgba(255,255,255,0.7)'
                },
                coloredFill: {
                    fillColor: 'rgba(255,255,255,0.7)'
                },
                valueMarkerFill: {
                    fillColor: 'black'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'black',
                    fontWeight: 'bold'
                },
                quantityText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'white',
                    fontWeight: 'bold'
                },
                cancelText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'black',
                    fontWeight: 'bold'
                },
                valueMarketText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'white',
                }
            },
            Dark: {
                buyColors: {
                    solidColor: '#0a0',
                    opaqueColor: '#0a0',
                    highOpacityColor: 'rgba(0,0,255,1)'
                },
                sellColors: {
                    solidColor: '#e55456',
                    opaqueColor: '#e55456',
                    highOpacityColor: 'rgba(229,84,86,0.6)'
                },
                line: {
                    strokeColor: 'black',
                    width: 1,
                    lineStyle: 'solid'
                },
                dashedLine: {
                    strokeColor: 'black',
                    width: 1,
                    lineStyle: 'dash'
                },
                fill: {
                    fillColor: 'rgba(0,0,0,0.7)'
                },
                coloredFill: {
                    fillColor: 'rgba(0,255,255,1)'
                },
                valueMarkerFill: {
                    fillColor: 'black'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white',
                    fontWeight: 'bold'
                },
                quantityText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'white',
                    fontWeight: 'bold'
                },
                cancelText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'black',
                    fontWeight: 'bold'
                },
                valueMarketText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'white',
                }
            }
        };
    };
    TradingDrawingsDefaultSettings.getTradingPositionTheme = function () {
        return {
            Light: {
                dashedLine: {
                    strokeColor: 'rgb(64,148,232)',
                    width: 1,
                    lineStyle: 'dash'
                },
                borderLine: {
                    strokeColor: 'rgba(64,148,232,0.7)',
                    width: 1,
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(255,255,255,0.7)'
                },
                coloredFill: {
                    fillColor: 'rgba(64,148,232,0.7)'
                },
                valueMarkerFill: {
                    fillColor: 'rgb(64,148,232)'
                },
                text: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'rgb(64,148,232)',
                    fontWeight: 'bold'
                },
                cancelText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'rgb(64,148,232)',
                    fontWeight: 'bold'
                },
                quantityText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'white',
                    fontWeight: 'bold'
                },
                valueMarketText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'white',
                }
            },
            Dark: {
                dashedLine: {
                    strokeColor: '#4094e8',
                    width: 1,
                    lineStyle: 'dash'
                },
                borderLine: {
                    strokeColor: 'rgba(64,148,232,0.7)',
                    width: 1,
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0,0,0,0.7)'
                },
                coloredFill: {
                    fillColor: 'rgba(64,148,232,0.7)'
                },
                valueMarkerFill: {
                    fillColor: '#4094e8'
                },
                text: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: '#4094e8',
                    fontWeight: 'bold'
                },
                cancelText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: '#4094e8',
                    fontWeight: 'bold'
                },
                quantityText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: '#ffffff',
                    fontWeight: 'bold'
                },
                valueMarketText: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: '#ffffff',
                }
            }
        };
    };
    return TradingDrawingsDefaultSettings;
}());
export { TradingDrawingsDefaultSettings };
//# sourceMappingURL=TradingDrawingsDefaultSettings.js.map