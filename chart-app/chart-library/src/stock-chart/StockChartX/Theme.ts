/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/**
 * The stroke theme structure.
 * @typedef {object} StrokeTheme
 * @type {object}
 * @property {boolean} [strokeEnabled = true] The flag that indicates whether stroke theme is enabled.
 * @property {StrokePriority} [strokePriority = 'color'] The stroke priority (for future use).
 * @property {number} [width = 1] The stroke width.
 * @property {string} [strokeColor = 'black'] The stroke color.
 * @property {LineStyle} [lineStyle = 'solid'] The stroke style.
 * @property {string} [lineCap = 'butt'] The style of the end caps for the line.
 * Possible values are 'butt', 'round' and 'square'.
 * @property {string} [lineJoin = 'miter'] The type of corner created, when two lines meet.
 * Possible values are 'bevel', 'round' and 'miter'.
 * @memberOf StockChartX
 * @example
 * // Stroke theme for the solid red 5 px line.
 * var strokeTheme = {
     *  width: 5,
     *  strokeColor: 'red'
     * };
 *
 * // Stroke theme for the dashed green line
 * var strokeTheme = {
     *  strokeColor: 'green',
     *  lineStyle: LineStyle.DASH
     * };
 */

/**
 * The fill theme structure.
 * @typedef {object} FillTheme
 * @type {object}
 * @property {boolean} [fillEnabled = true] The flag that indicates whether fill theme is enabled.
 * @property {FillPriority} [fillPriority = 'color'] The fill priority (for future use).
 * @property {string} [fillColor = 'black'] The fill color.
 * @memberOf StockChartX
 * @example
 * // Red fill theme
 * var fillTheme = {
     *  fillColor: 'red'
     * };
 */

import {IValueMarkerTheme} from './Scales/ValueMarker';

/**
 * The text theme structure.
 * @typedef {object} TextTheme
 * @type {object}
 * @mixes StrokeTheme
 * @mixes FillTheme
 * @property {String}[fontFamily = 'Arial'] The font family (e.g. 'Arial', 'Calibri', ..). 'Arial' by default.
 * @property {Number} [fontSize = 12] The font size.
 * @property {String} [fontStyle = 'normal'] The font style (e.g. 'normal', 'italic'). 'normal' by default.
 * @property {String} [fontWeight = 'normal'] The font weight (e.g. 'normal', 'bold'). 'normal' by default.
 * @property {String} [fontVariant = 'normal'] The font variant.
 * @memberOf StockChartX
 * @example
 * var theme = {
     *  fontFamily: 'Times New Roman',
     *  fontSize: 14,
     *  fillColor: 'green',
     *  strokeEnabled: false
     * };
 */

const cloneDeep = require('lodash/cloneDeep');

/**
 * Stroke priority enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const StrokePriority = {
    /** The solid color stroke style. */
    COLOR: 'color'
};
Object.freeze(StrokePriority);

/**
 * Fill priority enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf
 */
export const FillPriority = {
    /** The solid color fill style. */
    COLOR: 'color'
};
Object.freeze(FillPriority);

/**
 * Line styles enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const LineStyle = {
    /** The solid line style. */
    SOLID: 'solid',

    /** The dashed line style. */
    DASH: 'dash',

    /** The dotted line style. */
    DOT: 'dot',

    /** DASH_DOT The dashed-dotted line style. */
    DASH_DOT: 'dash-dot'
};
Object.freeze(LineStyle);

/**
 * Default font properties.
 * @name FontDefaults
 * @type {object}
 * @property {string} fontFamily The font family (e.g. 'Arial', 'Calibri', ..).
 * @property {number} fontSize The font size.
 * @property {string} fontStyle The font style (e.g. 'normal', 'italic').
 * @property {string} fontVariant The font variant.
 * @property {string} fontWeight The font weight (e.g. 'normal', 'bold').
 * @memberOf StockChartX
 */
export let FontDefaults = {
    fontFamily: 'Arial',
    fontSize: 20,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal'
};
export let StrokeDefaults = {
    strokePriority: 'color',
    strokeColor: 'black',
    width: 1,
    lineStyle: LineStyle.SOLID,
    lineJoin: 'miter',
    lineCap: 'butt',
    textAlign:'left',
    textBaseline:'alphabetic',
};

export let DashArray = {
    DOT: [1,2],
    DASH: [4, 4],
    DASH_DOT: [4, 4, 1 , 2]
};

export interface IStrokeTheme {
    strokeEnabled?: boolean;
    strokePriority?: string;
    width?: number;
    strokeColor?: string;
    lineStyle?: string;
    lineCap?: string;
    lineJoin?: string;
    textAlign?:string;
    textBaseline?:string;
}

export interface IGridTheme {
    horizontalLines:IStrokeTheme;
    verticalLines:IStrokeTheme;
}


export interface IFillTheme {
    fillEnabled?: boolean;
    fillPriority?: string;
    fillColor: string;
}

export interface ITextTheme extends IStrokeTheme, IFillTheme {
    fontFamily: string;
    fontSize: number;
    fontStyle?: string;
    fillColor: string;
    fontVariant?: string;
    fontWeight?: string;
    backgroundColor?:string;
    borderColor?:string;
    textBackgroundEnabled?:boolean;
    textBorderEnabled?:boolean;
    textWrapEnabled?:boolean;
    decoration?:string;
}

export let Theme: {[key: string]: ChartTheme} = {
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
                horizontalLines:{
                        width: 1,
                        strokeColor: '#363c4e',
                        lineStyle:'solid',
                        strokeEnabled:true
                },
                verticalLines:{
                        width: 1,
                        strokeColor: '#363c4e',
                        lineStyle:'solid',
                        strokeEnabled:true
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
        pointerPoint:{
            selectionMarker: {
                line: {
                    strokeColor: '#fff',
                    width: 2
                },
                fill: {
                    fillColor: '#000'
                }
            },
            movingSelectionMarker :{
                line: {
                    strokeColor: '#fff',
                    width: 2
                },
                fill: {
                    fillColor: '#FF0000'
                },
            },
            onPriceSelectionMarker:{
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
                width:2,
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
                horizontalLines:{
                        width: 1,
                        strokeColor: '#e6e6e6',
                        lineStyle:'solid',
                        strokeEnabled:true
                },
                verticalLines:{
                        width: 1,
                        strokeColor: '#e6e6e6',
                        lineStyle:'solid',
                        strokeEnabled:true
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
            movingSelectionMarker : {
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
                width:2,
            },

        }
    }
};

export interface ChartPanelTheme {
    grid: IGridTheme,
    title: ITextTheme
}

export interface PlotTheme {

}

export interface FilledWithBorderTheme {
    border: IStrokeTheme,
    fill: IFillTheme
}


export interface ColumnPlotTheme extends PlotTheme {
    upColumn: FilledWithBorderTheme,
    downColumn: FilledWithBorderTheme,
}

export interface LineConnectedPlotTheme extends PlotTheme {
    upLine:IStrokeTheme,
    downLine: IStrokeTheme
}

export interface LabelConnectedPlotTheme extends PlotTheme {
    stroke: IStrokeTheme
}

export interface PointPlotTheme extends IStrokeTheme, PlotTheme {

}

export interface LinePlotTheme extends IStrokeTheme, PlotTheme {

}

export interface MountainLinePlotTheme extends PlotTheme {
    line: LinePlotTheme,
    fill: IFillTheme
}

export interface BarPlotTheme extends PlotTheme {
    upBar: IStrokeTheme,
    downBar: IStrokeTheme
}

export interface FillPlotTheme extends PlotTheme {
    fill: IFillTheme
}

export interface LineCandlePlotTheme extends PlotTheme {
    upCandle: {
        border: IStrokeTheme
    },
    downCandle: {
        border: IStrokeTheme
    }
}

export interface CandlePlotTheme extends PlotTheme {
    upCandle: {
        border: IStrokeTheme,
        fill: IFillTheme,
        wick: IStrokeTheme
    },
    downCandle: {
        border: IStrokeTheme,
        fill: IFillTheme,
        wick: IStrokeTheme
    }
}

export interface WicklessCandlePlotTheme extends PlotTheme {
    upCandle: {
        border: IStrokeTheme,
        fill: IFillTheme,
    },
    downCandle: {
        border: IStrokeTheme,
        fill: IFillTheme,
    }
}

export interface HollowCandlePlotTheme extends CandlePlotTheme {
    upHollowCandle: {
        border: IStrokeTheme,
        wick: IStrokeTheme
    },
    downHollowCandle: {
        border: IStrokeTheme,
        wick: IStrokeTheme
    }
}

export interface VolumeProfilerPlotTheme extends PlotTheme {
    fillBox: IFillTheme,
    showVolumeProfile:boolean,
    boxWidth:number,
    placement:string,
    downArea:IFillTheme,
    downVolume:IFillTheme,
    upArea:IFillTheme,
    upVolume:IFillTheme,
    line:IStrokeTheme
}

export interface KumoPlotTheme extends PlotTheme {
    upColor: IFillTheme,
    downColor: IFillTheme
}

export interface ValueScaleTheme {
    text: ITextTheme,
    line: IStrokeTheme,
    border: IStrokeTheme,
    valueMarker: IValueMarkerTheme
}

export interface DateScaleTheme {
    text: ITextTheme,
    line: IStrokeTheme,
    border: IStrokeTheme
}

export interface ChartTheme {
    name: string,
    chart: {
        background: string[],
        border: IStrokeTheme,
        instrumentWatermark: {
            symbol: ITextTheme,
            details: ITextTheme
        }
    },
    splitter: {
        fillColor: string,
        hoverFillColor: string
    },
    chartPanel: ChartPanelTheme,
    valueScale: ValueScaleTheme,
    dateScale: DateScaleTheme,
    crossHair: {
        text: ITextTheme,
        line: IStrokeTheme,
        fill: IFillTheme
    },
    plot: {
        point: PointPlotTheme,
        line: {
            simple: LinePlotTheme,
            mountain: MountainLinePlotTheme,
            step: LinePlotTheme
        },
        histogram: {
            columnByPrice: ColumnPlotTheme,
            columnByValue: ColumnPlotTheme,
            column: {
                line: IStrokeTheme,
                fill: IFillTheme
            }
        },
        fillPlot:FillPlotTheme,
        bar: {
            OHLC: IStrokeTheme,
            HLC: IStrokeTheme,
            HL: IStrokeTheme,
            coloredOHLC: BarPlotTheme,
            coloredHLC: BarPlotTheme,
            coloredHL: BarPlotTheme,
            candle: CandlePlotTheme,
            heikinAshi: CandlePlotTheme,
            renko: WicklessCandlePlotTheme,
            lineBreak: WicklessCandlePlotTheme,
            hollowCandle: HollowCandlePlotTheme,
            pointAndFigure: LineCandlePlotTheme,
            kagi: LineCandlePlotTheme
        },
        lineConnectedPoints: LineConnectedPlotTheme,
        labelConnectedPoints: LabelConnectedPlotTheme
    },
    pointerPoint: {
        selectionMarker: { line: IStrokeTheme, fill: IFillTheme },
        movingSelectionMarker : { line: IStrokeTheme , fill: IFillTheme }
        onPriceSelectionMarker: { line: IStrokeTheme , fill: IFillTheme }
    },
    drawing: {
        abstract: {
            line: IStrokeTheme,
            fill: IFillTheme,
            text: ITextTheme
        },
        abstractMarker: {
            fill: IFillTheme
        },
        fibonacci: {
            trendLine: IStrokeTheme,
            line: IStrokeTheme,
            fill: IFillTheme,
            text: ITextTheme
        },
        priceLabel: {
            text: ITextTheme,
            line: IStrokeTheme,
            fill: IFillTheme
        },
        arrowUp: {
            text: ITextTheme,
            fill: IFillTheme
        },
        arrowDown: {
            text: ITextTheme,
            fill: IFillTheme
        },
        arrowLeft: {
            text: ITextTheme,
            fill: IFillTheme
        },
        arrowRight: {
            text: ITextTheme,
            fill: IFillTheme
        },
        text: {
            text: ITextTheme,
            fill: IFillTheme,
            line: IStrokeTheme
        },
        image: {
            noImage: {
                line: IStrokeTheme
            }
        },
        flag: {
            fill: IFillTheme,
            width: number,
        },

    }
}


export class ThemeUtils {

    public static mapThemeValuesForBackwardCompatibility(currentThemeValues:{[key:string]:unknown}, defaultThemeValues:{[key:string]:unknown}) {

        // -----------------------------------------------------------------------------------
        // MA make sure that currentThemeValues matches "in structure" defaultThemeValues.
        // To do that:
        // 1) if there is any "structure" (ie object) in original theme and not in loaded theme, then copy it.
        // 2) if there is any "structure" (ie object) in loaded theme and not in original theme, then delete it.
        // 3) if there is any "values" that are in original theme but not in loaded theme, then copy them.
        // 4) if there is any "values" that are in loaded theme but not in original theme, then leave them as is, cause they maybe
        //    auto-generated values that aren't part of theme, since theme doesn't specify all optional attributes and they can be
        //    set later at run-time from drawing setting dialog.
        // -----------------------------------------------------------------------------------

        for(let key in defaultThemeValues) {
            if(!(key in currentThemeValues)){
                currentThemeValues[key] = cloneDeep(defaultThemeValues[key]); // step 1 & step 3
            } else if(typeof defaultThemeValues[key] === 'object') {
                this.mapThemeValuesForBackwardCompatibility(currentThemeValues[key] as {[key:string]:unknown},
                    defaultThemeValues[key] as {[key:string]:unknown}); // go recursively
            }
        }

        for(let key in currentThemeValues) {
            if(!(key in defaultThemeValues) && (typeof currentThemeValues[key] === 'object')){
                delete currentThemeValues[key]; // step 2
            }
        }

    }
}
