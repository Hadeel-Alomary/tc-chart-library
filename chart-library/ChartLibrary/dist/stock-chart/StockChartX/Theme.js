var cloneDeep = require('lodash/cloneDeep');
export var StrokePriority = {
    COLOR: 'color'
};
Object.freeze(StrokePriority);
export var FillPriority = {
    COLOR: 'color'
};
Object.freeze(FillPriority);
export var LineStyle = {
    SOLID: 'solid',
    DASH: 'dash',
    DOT: 'dot',
    DASH_DOT: 'dash-dot'
};
Object.freeze(LineStyle);
export var FontDefaults = {
    fontFamily: 'Arial',
    fontSize: 20,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal'
};
export var StrokeDefaults = {
    strokePriority: 'color',
    strokeColor: 'black',
    width: 1,
    lineStyle: LineStyle.SOLID,
    lineJoin: 'miter',
    lineCap: 'butt',
    textAlign: 'left',
    textBaseline: 'alphabetic',
};
export var DashArray = {
    DOT: [1, 2],
    DASH: [4, 4],
    DASH_DOT: [4, 4, 1, 2]
};
export var Theme = {
    Dark: {
        name: 'Dark',
        chart: {
            background: ['#131722', '#131722'],
            border: {
                width: 1,
                strokeColor: 'grey',
                lineStyle: 'solid'
            },
            instrumentWatermark: {
                symbol: {
                    fontFamily: 'Arial',
                    fontSize: 70,
                    fontStyle: 'normal',
                    fillColor: 'white'
                },
                details: {
                    fontFamily: 'Arial',
                    fontSize: 40,
                    fontStyle: 'normal',
                    fillColor: 'white'
                }
            }
        },
        splitter: {
            fillColor: '#666',
            hoverFillColor: '#ccc'
        },
        chartPanel: {
            grid: {
                horizontalLines: {
                    width: 1,
                    strokeColor: '#363c4e',
                    lineStyle: 'solid',
                    strokeEnabled: true
                },
                verticalLines: {
                    width: 1,
                    strokeColor: '#363c4e',
                    lineStyle: 'solid',
                    strokeEnabled: true
                }
            },
            title: {
                fontFamily: 'Arial',
                fontSize: 11,
                fontStyle: 'normal',
                fillColor: 'white'
            }
        },
        valueScale: {
            text: {
                fontFamily: 'Arial',
                fontSize: 11,
                fontStyle: 'normal',
                fillColor: '#f8f8f8'
            },
            line: {
                width: 1,
                strokeColor: '#505050'
            },
            border: {
                width: 1,
                strokeColor: '#888',
                lineStyle: 'solid'
            },
            valueMarker: {
                text: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'black'
                },
                fill: {
                    fillColor: 'green'
                }
            }
        },
        dateScale: {
            text: {
                fontFamily: 'Arial',
                fontSize: 11,
                fillColor: '#f8f8f8'
            },
            line: {
                width: 1,
                strokeColor: '#505050'
            },
            border: {
                width: 1,
                strokeColor: '#888',
                lineStyle: 'solid'
            }
        },
        crossHair: {
            text: {
                fontFamily: 'Arial',
                fontSize: 11,
                fillColor: '#000'
            },
            line: {
                width: 1,
                strokeColor: '#ccc',
                lineStyle: 'dashed'
            },
            fill: {
                fillColor: '#ccc'
            }
        },
        plot: {
            point: {
                width: 1,
                strokeColor: '#333',
                lineStyle: 'solid'
            },
            line: {
                simple: {
                    width: 3,
                    strokeColor: 'rgb(33, 150, 243)'
                },
                mountain: {
                    line: {
                        width: 3,
                        strokeColor: 'rgb(33, 150, 243)'
                    },
                    fill: {
                        fillColor: 'rgba(33, 150, 243 , 0.1)'
                    }
                },
                step: {
                    width: 1,
                    strokeColor: 'white'
                }
            },
            histogram: {
                columnByPrice: {
                    upColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#008000'
                        },
                        fill: {
                            fillColor: '#008000'
                        }
                    },
                    downColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'red'
                        },
                        fill: {
                            fillColor: 'red'
                        }
                    },
                },
                columnByValue: {
                    upColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'black'
                        },
                        fill: {
                            fillColor: 'black'
                        }
                    },
                    downColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'red'
                        },
                        fill: {
                            fillColor: 'red'
                        }
                    },
                },
                column: {
                    line: {
                        strokeEnabled: false,
                        width: 1,
                        strokeColor: 'white'
                    },
                    fill: {
                        fillColor: 'blue'
                    }
                }
            },
            fillPlot: {
                fill: {
                    fillColor: 'blue'
                }
            },
            bar: {
                OHLC: {
                    width: 1,
                    strokeColor: 'white'
                },
                HLC: {
                    width: 1,
                    strokeColor: 'white'
                },
                HL: {
                    width: 1,
                    strokeColor: 'white'
                },
                coloredOHLC: {
                    upBar: {
                        width: 1,
                        strokeColor: '#26a69a'
                    },
                    downBar: {
                        width: 1,
                        strokeColor: '#ef5350'
                    }
                },
                coloredHLC: {
                    upBar: {
                        width: 1,
                        strokeColor: '#26a69a'
                    },
                    downBar: {
                        width: 1,
                        strokeColor: '#ef5350'
                    }
                },
                coloredHL: {
                    upBar: {
                        width: 1,
                        strokeColor: '#26a69a'
                    },
                    downBar: {
                        width: 1,
                        strokeColor: '#ef5350'
                    }
                },
                candle: {
                    upCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#26a69a'
                        },
                        fill: {
                            fillColor: '#26a69a'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#26a69a'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#ef5350'
                        },
                        fill: {
                            fillColor: '#ef5350'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#ef5350'
                        }
                    }
                },
                heikinAshi: {
                    upCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#26a69a'
                        },
                        fill: {
                            fillColor: '#26a69a'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#26a69a'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#ef5350'
                        },
                        fill: {
                            fillColor: '#ef5350'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#ef5350'
                        }
                    }
                },
                renko: {
                    upCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#26a69a'
                        },
                        fill: {
                            fillColor: '#26a69a'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#ef5350'
                        },
                        fill: {
                            fillColor: '#ef5350'
                        }
                    }
                },
                lineBreak: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#26a69a'
                        },
                        fill: {
                            fillEnabled: false,
                            fillColor: '#26a69a'
                        },
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#ef5350'
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: '#ef5350'
                        }
                    }
                },
                hollowCandle: {
                    upCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#26a69a'
                        },
                        fill: {
                            fillColor: '#26a69a'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#26a69a'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#ef5350'
                        },
                        fill: {
                            fillColor: '#ef5350'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#ef5350'
                        }
                    },
                    upHollowCandle: {
                        border: {
                            width: 1,
                            strokeColor: '#26a69a'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#26a69a'
                        }
                    },
                    downHollowCandle: {
                        border: {
                            width: 1,
                            strokeColor: '#ef5350'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#ef5350'
                        }
                    }
                },
                pointAndFigure: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#26a69a'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#ef5350'
                        }
                    }
                },
                kagi: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#26a69a'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#ef5350'
                        }
                    }
                }
            },
            lineConnectedPoints: {
                upLine: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'green',
                    lineStyle: 'solid'
                },
                downLine: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'red',
                    lineStyle: 'solid'
                }
            },
            labelConnectedPoints: {
                stroke: {
                    strokeColor: 'black',
                    width: 1
                }
            }
        },
        pointerPoint: {
            selectionMarker: {
                line: {
                    strokeColor: '#fff',
                    width: 2
                },
                fill: {
                    fillColor: '#000'
                }
            },
            movingSelectionMarker: {
                line: {
                    strokeColor: '#fff',
                    width: 2
                },
                fill: {
                    fillColor: '#FF0000'
                },
            },
            onPriceSelectionMarker: {
                line: {
                    strokeColor: '#fff',
                    width: 2
                },
                fill: {
                    fillColor: '#1E90FF'
                },
            }
        },
        drawing: {
            abstract: {
                line: {
                    strokeColor: 'white',
                    width: 1
                },
                fill: {
                    fillColor: 'rgba(255, 255, 255, 0.3)'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'white',
                    decoration: ''
                }
            },
            abstractMarker: {
                fill: {
                    fillColor: 'white'
                }
            },
            fibonacci: {
                trendLine: {
                    strokeColor: 'white',
                    width: 1,
                    lineStyle: 'dash'
                },
                line: {
                    strokeColor: 'white',
                    width: 1
                },
                fill: {
                    fillColor: 'rgba(255, 255, 255, 0.3)'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'white'
                }
            },
            priceLabel: {
                text: {
                    fillColor: '#000',
                    fontFamily: 'Arial',
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
                line: {
                    strokeColor: '#4169E1',
                    width: 1
                },
                fill: {
                    fillColor: 'rgb(255,255,255)'
                }
            },
            arrowUp: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'center',
                    fontSize: 20,
                },
                fill: {
                    fillColor: 'limegreen'
                }
            },
            arrowDown: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'center',
                    fontSize: 20,
                },
                fill: {
                    fillColor: 'red'
                }
            },
            arrowLeft: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'center',
                    fontSize: 20,
                },
                fill: {
                    fillColor: 'limegreen'
                }
            },
            arrowRight: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'center',
                    fontSize: 20,
                },
                fill: {
                    fillColor: 'limegreen'
                }
            },
            text: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: '#FFFFFF',
                    decoration: ''
                },
                fill: {
                    fillColor: 'rgba(255, 165, 0, 0.3)',
                },
                line: {
                    strokeColor: 'rgb(153, 0, 0)',
                    width: 1
                }
            },
            image: {
                noImage: {
                    line: {
                        strokeColor: 'red',
                        width: 1
                    }
                }
            },
            flag: {
                fill: {
                    fillColor: '#006400'
                },
                width: 2,
            },
        }
    },
    Light: {
        name: 'Light',
        chart: {
            background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
            border: {
                width: 1,
                strokeColor: 'grey',
                lineStyle: 'solid'
            },
            instrumentWatermark: {
                symbol: {
                    fontFamily: 'Arial',
                    fontSize: 70,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                details: {
                    fontFamily: 'Arial',
                    fontSize: 40,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            }
        },
        splitter: {
            fillColor: '#999',
            hoverFillColor: '#333'
        },
        chartPanel: {
            grid: {
                horizontalLines: {
                    width: 1,
                    strokeColor: '#e6e6e6',
                    lineStyle: 'solid',
                    strokeEnabled: true
                },
                verticalLines: {
                    width: 1,
                    strokeColor: '#e6e6e6',
                    lineStyle: 'solid',
                    strokeEnabled: true
                }
            },
            title: {
                fontFamily: 'Arial',
                fontSize: 11,
                fontStyle: 'normal',
                fillColor: '#333'
            }
        },
        valueScale: {
            text: {
                fontFamily: 'Arial',
                fontSize: 11,
                fontStyle: 'normal',
                fillColor: '#333'
            },
            line: {
                width: 1,
                strokeColor: '#CCC'
            },
            border: {
                width: 1,
                strokeColor: '#CCC',
                lineStyle: 'solid'
            },
            valueMarker: {
                text: {
                    fontFamily: 'Arial',
                    fontSize: 11,
                    fillColor: 'black'
                },
                fill: {
                    fillColor: 'green'
                }
            }
        },
        dateScale: {
            text: {
                fontFamily: 'Arial',
                fontSize: 11,
                fillColor: '#333'
            },
            line: {
                width: 1,
                strokeColor: '#CCC'
            },
            border: {
                width: 1,
                strokeColor: '#CCC',
                lineStyle: 'solid'
            }
        },
        crossHair: {
            text: {
                fontFamily: 'Arial',
                fontSize: 11,
                fillColor: 'white'
            },
            line: {
                width: 1,
                strokeColor: '#333',
                lineStyle: 'dashed'
            },
            fill: {
                fillColor: '#22242a'
            }
        },
        plot: {
            point: {
                width: 1,
                strokeColor: '#333',
                lineStyle: 'solid'
            },
            line: {
                simple: {
                    width: 1,
                    strokeColor: '#555'
                },
                mountain: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    }
                },
                step: {
                    width: 1,
                    strokeColor: '#555'
                }
            },
            histogram: {
                columnByPrice: {
                    upColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'green'
                        },
                        fill: {
                            fillColor: 'green'
                        }
                    },
                    downColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'red'
                        },
                        fill: {
                            fillColor: 'red'
                        }
                    },
                },
                columnByValue: {
                    upColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'black'
                        },
                        fill: {
                            fillColor: 'black'
                        }
                    },
                    downColumn: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'red'
                        },
                        fill: {
                            fillColor: 'red'
                        }
                    },
                },
                column: {
                    line: {
                        strokeEnabled: false,
                        width: 1,
                        strokeColor: '#555'
                    },
                    fill: {
                        fillColor: 'blue'
                    }
                }
            },
            fillPlot: {
                fill: {
                    fillColor: 'blue'
                }
            },
            bar: {
                OHLC: {
                    width: 1,
                    strokeColor: '#555'
                },
                HLC: {
                    width: 1,
                    strokeColor: '#555'
                },
                HL: {
                    width: 1,
                    strokeColor: '#555'
                },
                coloredOHLC: {
                    upBar: {
                        width: 1,
                        strokeColor: '#6ba583'
                    },
                    downBar: {
                        width: 1,
                        strokeColor: '#d75442'
                    }
                },
                coloredHLC: {
                    upBar: {
                        width: 1,
                        strokeColor: 'green'
                    },
                    downBar: {
                        width: 1,
                        strokeColor: 'red'
                    }
                },
                coloredHL: {
                    upBar: {
                        width: 1,
                        strokeColor: 'green'
                    },
                    downBar: {
                        width: 1,
                        strokeColor: 'red'
                    }
                },
                candle: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#6ba583'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#5b1a13'
                        },
                        fill: {
                            fillColor: '#d75442'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    }
                },
                heikinAshi: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#6ba583'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#d75442'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    }
                },
                renko: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#6ba583'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#d75442'
                        }
                    }
                },
                lineBreak: {
                    upCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: 'green'
                        },
                        fill: {
                            fillColor: 'green'
                        },
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: 'red'
                        },
                        fill: {
                            fillColor: 'red'
                        }
                    }
                },
                hollowCandle: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#6ba583'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: '#225437'
                        },
                        fill: {
                            fillColor: '#d75442'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    },
                    upHollowCandle: {
                        border: {
                            width: 1,
                            strokeColor: '#6ba583'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    },
                    downHollowCandle: {
                        border: {
                            width: 1,
                            strokeColor: '#d75442'
                        },
                        wick: {
                            width: 1,
                            strokeColor: '#737375'
                        }
                    }
                },
                pointAndFigure: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'green'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'red'
                        }
                    }
                },
                kagi: {
                    upCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'green'
                        }
                    },
                    downCandle: {
                        border: {
                            strokeEnabled: true,
                            width: 1,
                            strokeColor: 'red'
                        }
                    }
                }
            },
            lineConnectedPoints: {
                upLine: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'green',
                    lineStyle: 'solid'
                },
                downLine: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'red',
                    lineStyle: 'solid'
                }
            },
            labelConnectedPoints: {
                stroke: {
                    strokeColor: 'black',
                    width: 1
                }
            }
        },
        pointerPoint: {
            selectionMarker: {
                line: {
                    strokeColor: '#000',
                    width: 2
                },
                fill: {
                    fillColor: '#fff'
                }
            },
            movingSelectionMarker: {
                line: {
                    strokeColor: '#000',
                    width: 2
                },
                fill: {
                    fillColor: '#FF0000'
                },
            },
            onPriceSelectionMarker: {
                line: {
                    strokeColor: '#000',
                    width: 2
                },
                fill: {
                    fillColor: '#1E90FF'
                },
            }
        },
        drawing: {
            abstract: {
                line: {
                    strokeColor: '#555',
                    width: 1
                },
                fill: {
                    fillColor: 'rgba(255, 255, 255, 0.3)'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: '#555',
                    decoration: ''
                }
            },
            abstractMarker: {
                fill: {
                    fillColor: '#555'
                }
            },
            fibonacci: {
                trendLine: {
                    strokeColor: 'black',
                    width: 1,
                    lineStyle: 'dash'
                },
                line: {
                    strokeColor: 'black',
                    width: 1
                },
                fill: {
                    fillColor: 'rgba(0, 0, 0, 0.3)'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black'
                }
            },
            priceLabel: {
                text: {
                    fillColor: '#000',
                    fontFamily: 'Arial',
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
                line: {
                    strokeColor: '#4169E1',
                    width: 1
                },
                fill: {
                    fillColor: 'rgb(255,255,255)'
                }
            },
            arrowUp: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'center',
                    fontSize: 20,
                },
                fill: {
                    fillColor: '#006400'
                }
            },
            arrowDown: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'center',
                    fontSize: 20,
                },
                fill: {
                    fillColor: '#8B0000'
                }
            },
            arrowLeft: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    fontSize: 20,
                },
                fill: {
                    fillColor: '#006400'
                }
            },
            arrowRight: {
                text: {
                    fontFamily: 'Calibri',
                    fillColor: '#696969',
                    textAlign: 'right',
                    fontSize: 20,
                },
                fill: {
                    fillColor: '#006400'
                }
            },
            text: {
                text: {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fillColor: '#000',
                    textAlign: 'center',
                    textBaseline: 'top',
                    decoration: ''
                },
                fill: {
                    fillColor: 'rgba(255, 165, 0, 0.3)',
                },
                line: {
                    strokeColor: 'rgb(153, 0, 0)',
                    width: 1
                }
            },
            image: {
                noImage: {
                    line: {
                        strokeColor: 'red',
                        width: 1
                    }
                }
            },
            flag: {
                fill: {
                    fillColor: '#006400'
                },
                width: 2,
            },
        }
    }
};
var ThemeUtils = (function () {
    function ThemeUtils() {
    }
    ThemeUtils.mapThemeValuesForBackwardCompatibility = function (currentThemeValues, defaultThemeValues) {
        for (var key in defaultThemeValues) {
            if (!(key in currentThemeValues)) {
                currentThemeValues[key] = cloneDeep(defaultThemeValues[key]);
            }
            else if (typeof defaultThemeValues[key] === 'object') {
                this.mapThemeValuesForBackwardCompatibility(currentThemeValues[key], defaultThemeValues[key]);
            }
        }
        for (var key in currentThemeValues) {
            if (!(key in defaultThemeValues) && (typeof currentThemeValues[key] === 'object')) {
                delete currentThemeValues[key];
            }
        }
    };
    return ThemeUtils;
}());
export { ThemeUtils };
//# sourceMappingURL=Theme.js.map