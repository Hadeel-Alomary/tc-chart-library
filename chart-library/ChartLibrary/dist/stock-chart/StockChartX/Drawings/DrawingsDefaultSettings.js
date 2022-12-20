import { FibonacciLevelLineExtension } from './FibonacciDrawings/FibonacciDrawingLevelLineExtension';
import { DrawingTextHorizontalPosition, DrawingTextVerticalPosition } from './DrawingTextPosition';
import { VolumeProfilerSettingsRowType } from '../../../services/volume-profiler/volume-profiler.service';
import { ChartAccessorService } from '../../../services/chart';
import { ThemeType } from '../ThemeType';
var DrawingsDefaultSettings = (function () {
    function DrawingsDefaultSettings() {
    }
    DrawingsDefaultSettings.getDrawingDefaultSettings = function (themeType, className) {
        var settings = DrawingsDefaultSettings.drawingSavedDefaultSettings[className] || DrawingsDefaultSettings.getDrawingOriginalSettings(themeType, className);
        return $.extend(true, {}, settings);
    };
    DrawingsDefaultSettings.hasCustomSettings = function (themeType, className) {
        return DrawingsDefaultSettings.drawingSavedDefaultSettings[className] != null;
    };
    DrawingsDefaultSettings.setDrawingDefaultSettings = function (themeType, className, settings) {
        var originalOptions = DrawingsDefaultSettings.getDrawingOriginalSettings(themeType, className);
        var optionsWeShouldSave = {};
        for (var _i = 0, _a = Object.keys(settings); _i < _a.length; _i++) {
            var option = _a[_i];
            if (originalOptions[option]) {
                optionsWeShouldSave[option] = settings[option];
            }
        }
        DrawingsDefaultSettings.drawingSavedDefaultSettings[className] = optionsWeShouldSave;
        DrawingsDefaultSettings.writeDrawingDefaultSettings();
    };
    DrawingsDefaultSettings.getResettedDrawingSettings = function (themeType, className, currentOptions) {
        DrawingsDefaultSettings.drawingSavedDefaultSettings[className] = null;
        DrawingsDefaultSettings.writeDrawingDefaultSettings();
        var originalOptions = DrawingsDefaultSettings.getDrawingOriginalSettings(themeType, className);
        var mergedOptions = {};
        for (var _i = 0, _a = Object.keys(currentOptions); _i < _a.length; _i++) {
            var option = _a[_i];
            mergedOptions[option] = originalOptions[option] ? originalOptions[option] : currentOptions[option];
        }
        return mergedOptions;
    };
    DrawingsDefaultSettings.resetAllSavedSettings = function () {
        DrawingsDefaultSettings.savedDefaultSettings = null;
        DrawingsDefaultSettings.writeDrawingDefaultSettings();
    };
    Object.defineProperty(DrawingsDefaultSettings, "drawingSavedDefaultSettings", {
        get: function () {
            if (!DrawingsDefaultSettings.savedDefaultSettings) {
                DrawingsDefaultSettings.savedDefaultSettings = ChartAccessorService.instance.getDrawingDefaultSettings() || {};
                DrawingsDefaultSettings.writeDrawingDefaultSettings();
            }
            return DrawingsDefaultSettings.savedDefaultSettings;
        },
        enumerable: true,
        configurable: true
    });
    DrawingsDefaultSettings.writeDrawingDefaultSettings = function () {
        ChartAccessorService.instance.setDrawingDefaultSettings(DrawingsDefaultSettings.savedDefaultSettings);
    };
    DrawingsDefaultSettings.getDrawingOriginalSettings = function (themeType, className) {
        return themeType == ThemeType.Light ?
            DrawingsDefaultSettings.getDrawingOriginalLightSettings(className) :
            DrawingsDefaultSettings.getDrawingOriginalDarkSettings(className);
    };
    DrawingsDefaultSettings.getDrawingOriginalDarkSettings = function (className) {
        switch (className) {
            case 'lineSegment':
            case 'trendChannel':
            case 'andrewsPitchfork':
            case 'tironeLevels':
            case 'quadrantLines':
            case 'errorChannel':
            case 'raffRegression':
            case 'oneOpenEndLineSegment':
            case 'twoOpenEndLineSegment':
            case 'arrowLineSegment':
            case 'angleLineSegment':
            case 'grid':
                return {
                    theme: {
                        line: {
                            strokeColor: '#ccc',
                            width: 1
                        },
                    }
                };
            case 'priceCalculation':
                return {
                    theme: {
                        line: {
                            strokeColor: '#56A5EC',
                            width: 2
                        },
                        text: {
                            fontFamily: 'Arial',
                            fontSize: 14,
                            fontStyle: "bold",
                            fillColor: "#ccc",
                            textAlign: "center",
                            textVerticalAlign: "middle"
                        }
                    }
                };
            case 'abcdPattern':
                return {
                    theme: {
                        line: {
                            strokeColor: '#008B00',
                            width: 2,
                        }
                    }
                };
            case 'elliottTripleComboWave':
            case 'elliottDoubleComboWave':
                return {
                    theme: {
                        line: {
                            strokeColor: '#7CCD7C',
                            width: 2,
                        }
                    }
                };
            case 'elliottTriangleWave':
                return {
                    theme: {
                        line: {
                            strokeColor: '#FF8C00',
                            width: 2,
                        }
                    }
                };
            case 'elliottImpulseWave':
            case 'elliottCorrectionWave':
                return {
                    theme: {
                        line: {
                            strokeColor: '#56A5EC',
                            width: 2,
                        }
                    }
                };
            case 'threeDrivesPattern':
                return {
                    theme: {
                        line: {
                            strokeColor: '#9528ff',
                            width: 2,
                        }
                    }
                };
            case 'cyclicLines':
                return {
                    theme: {
                        line: {
                            strokeColor: '#26a69a',
                            width: 1,
                        },
                        dashedLine: {
                            strokeColor: '#555',
                            width: 1,
                            lineStyle: 'dash'
                        }
                    }
                };
            case 'crossLine':
            case 'verticalLine':
                return {
                    theme: {
                        line: {
                            strokeColor: '#00FFFF',
                            width: 1
                        },
                        labelText: {
                            fontFamily: 'Calibri',
                            fontSize: 12,
                            fillColor: '#00FFFF',
                            decoration: ''
                        }
                    }
                };
            case 'horizontalLine':
            case 'horizontalRay':
                return {
                    theme: {
                        line: {
                            strokeColor: '#AFEEEE',
                            width: 1
                        },
                        text: {
                            fontFamily: 'DroidSansArabic',
                            fontSize: 14,
                            fillColor: 'green',
                            textAlign: "center",
                            textVerticalAlign: "bottom"
                        },
                    }
                };
            case 'trianglePattern':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(149,40,255)',
                            width: 1,
                        },
                        fill: {
                            fillColor: 'rgba(149,40,255, 0.5)',
                            fillEnabled: true
                        }
                    }
                };
            case 'rectangle':
            case 'triangle':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(46, 55, 254)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(46, 55, 254, 0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'band':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(155,155,27)',
                            width: 2,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(155,155,27,0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'rotatedRectangle':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(149, 40, 255)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(149, 40, 255, 0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'parallelChannel':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(149, 40, 255)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        middleLine: {
                            strokeColor: 'rgb(149, 40, 255)',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        fill: {
                            fillColor: 'rgba(149, 40, 255, 0.3)',
                            fillEnabled: true,
                        },
                        linesExtension: {
                            rightExtensionEnabled: false,
                            leftExtensionEnabled: false,
                        }
                    }
                };
            case 'arc':
            case 'circle':
            case 'ellipse':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(155,155,27)',
                            width: 2
                        },
                        fill: {
                            fillColor: 'rgba(155,155,27,0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'polyLine':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(0, 144, 193)',
                            width: 2,
                        },
                        fill: {
                            fillColor: 'rgba(0, 144, 193,0.1)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'flatTopBottom':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(73,133,231)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(70,100,190,0.4)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'timeCycles':
            case 'disjointAngle':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(124, 205, 124)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(124, 205, 124 , 0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'curve':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(34, 158, 135)',
                            width: 1
                        },
                        fill: {
                            fillColor: 'rgba(48, 111, 45 , 0.3)',
                            fillEnabled: false,
                        }
                    }
                };
            case 'brush':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(169,169,169)',
                            width: 3,
                        },
                        fill: {
                            fillColor: 'rgba(70,100,190,0.4)',
                            fillEnabled: false,
                        }
                    }
                };
            case 'headAndShoulders':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(69,104,47)',
                            width: 2,
                        },
                        fill: {
                            fillColor: 'rgba(81,165,21,0.6)',
                            fillEnabled: true
                        }
                    }
                };
            case 'cypherPattern':
            case 'xabcdPattern':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(204,40,149)',
                            width: 2,
                        },
                        fill: {
                            fillColor: 'rgba(204,40,149,0.4)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'sineLine':
                return {
                    theme: {
                        line: {
                            strokeColor: '#008B8B',
                            width: 2
                        }
                    }
                };
            case 'fibonacciRetracements':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.0, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.272, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'white',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                                fillColor: 'black',
                                textAlign: 'right',
                            }
                        },
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                        reverse: false,
                        levelLinesExtension: FibonacciLevelLineExtension.NONE
                    }
                };
            case 'fibonacciProjection':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.272, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 2,
                                    lineStyle: 'dash'
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'white',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                        reverse: false,
                        levelLinesExtension: FibonacciLevelLineExtension.NONE
                    }
                };
            case 'fibonacciExtensions':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2,
                                    lineStyle: 'dot'
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.382, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1,
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.5, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.764, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.382, theme: {
                                line: {
                                    strokeColor: 'rgb(100, 100, 100)',
                                    width: 1,
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(100, 100, 100)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(100, 100, 100, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204 , 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.236, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 6.853, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 11.088, theme: {
                                line: {
                                    strokeColor: 'rgb(200, 200, 140)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(200, 200, 140)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 17.941, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(200, 200, 140, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 29.029, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'white',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                        reverse: false,
                        levelLinesExtension: FibonacciLevelLineExtension.NONE
                    }
                };
            case 'fibonacciEllipses':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.382, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.382, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.216, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 6.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 8.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'white',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.BOTTOM,
                        showLevelValues: true,
                        showLevelPercents: true,
                    }
                };
            case 'fibonacciSpeedResistanceArcs':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0.236, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.786, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(204, 40, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3.618, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(149, 40, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.236, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'rgb(128, 128, 128)',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        showFullCircle: false,
                        showLevelBackgrounds: true,
                        showLevelValues: true,
                    }
                };
            case 'fibonacciFan':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.33, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.37, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.62, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.66, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'white',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                    }
                };
            case 'fibonacciTimeZones':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 5, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 8, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 13, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 21, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 34, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 55, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 89, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 144, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 233, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'white',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.BOTTOM,
                        showLevelValues: true,
                    }
                };
            case 'gannBox':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'right',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        }
                    ],
                    timeLevels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        }
                    ],
                    theme: {
                        angles: {
                            strokeColor: 'rgb(128,128,128)',
                            width: 1
                        },
                        reverse: false,
                        showTimeLevelBackground: true,
                        showPriceLevelBackground: true,
                        showBottomLabels: true,
                        showTopLabels: true,
                        showRightLabels: true,
                        showLeftLabels: true,
                        showAngles: false,
                    },
                };
            case 'fibonacciSpeedResistanceFan':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'right',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        }
                    ],
                    timeLevels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        }
                    ],
                    theme: {
                        grid: {
                            strokeEnabled: true,
                            strokeColor: 'rgb(128,128,128)',
                            width: 1,
                        },
                        showLevelBackgrounds: true,
                        showBottomLabels: true,
                        showTopLabels: true,
                        showRightLabels: true,
                        showLeftLabels: true,
                    }
                };
            case 'gannFan':
                return {
                    levels: [
                        {
                            visible: true,
                            value: '8/1', theme: {
                                line: {
                                    strokeColor: 'rgb(139,0,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(139,0,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(139,0,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '4/1', theme: {
                                line: {
                                    strokeColor: 'rgb(128,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,0,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '3/1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '2/1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/1', theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/2', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/4', theme: {
                                line: {
                                    strokeColor: 'rgb(0,255,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,255,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,255,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/8', theme: {
                                line: {
                                    strokeColor: 'rgb(139,69,19)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(139,69,19, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(139,69,19)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                    ],
                    theme: {
                        showLevelBackgrounds: true,
                        showLevelValues: true,
                    }
                };
            case 'gannSquare':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                },
                            },
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3, theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4, theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 5, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    fans: [
                        {
                            visible: false,
                            value: '1 * 8', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(128,0,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,0,0, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128,0,0)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '2 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: false,
                            value: '3 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '4 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '5 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(75,0,130)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(75,0,130, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(75,0,130)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '8 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                    ],
                    arcs: [
                        {
                            visible: true,
                            value: '0 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 *1.5', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 14,
                            fillColor: 'rgb(128, 128, 128)',
                        },
                        showLevelBackgrounds: true,
                        reverse: false,
                        showText: true,
                    },
                };
            case 'gannSquareFixed':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                },
                            },
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3, theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4, theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 5, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    fans: [
                        {
                            visible: false,
                            value: '1 * 8', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(128,0,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,0,0, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128,0,0)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '2 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: false,
                            value: '3 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '4 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '5 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(75,0,130)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(75,0,130, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(75,0,130)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '8 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                    ],
                    arcs: [
                        {
                            visible: true,
                            value: '0 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 1.5', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    theme: {
                        showLevelBackgrounds: true,
                        reverse: false,
                    },
                };
            case 'textAnchored':
            case 'text':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fontSize: 20,
                            fillColor: 'rgb(169,169,169)',
                            textAlign: 'center',
                            textBaseline: 'top',
                            decoration: '',
                            textBackgroundEnabled: false,
                            textBorderEnabled: false,
                            textWrapEnabled: false,
                        },
                        fill: {
                            fillColor: 'rgba(86, 165, 236, 0.3)',
                        },
                        borderLine: {
                            strokeColor: 'rgb(169,169,169)',
                            width: 1
                        }
                    }
                };
            case 'image':
                return {
                    theme: {
                        noImage: {
                            line: {
                                strokeColor: '#ff0000',
                                width: 1
                            }
                        }
                    }
                };
            case 'noteAnchored':
            case 'note':
                return {
                    theme: {
                        text: {
                            fillColor: '#000000',
                            fontFamily: 'Arial',
                            fontSize: 20,
                            textAlign: 'right',
                            textBaseline: 'bottom',
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        borderLine: {
                            strokeColor: '#005cb7',
                            width: 1
                        },
                        fill: {
                            fillColor: 'rgb(255,255,255)'
                        }
                    }
                };
            case 'callout':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            fillColor: '#FFFFFF',
                            fontSize: 16,
                            textBaseline: 'top',
                            textAlign: 'center',
                            textWrapEnabled: false,
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        borderLine: {
                            strokeColor: '#800000',
                            width: 2
                        },
                        fill: {
                            fillColor: 'rgba(128,0,0, 0.5)',
                        }
                    }
                };
            case 'priceLabel':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fillColor: 'rgb(169,169,169)',
                            fontSize: 14,
                            fontWeight: 'bold',
                            textBaseline: 'middle',
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        borderLine: {
                            strokeColor: 'rgb(169,169,169)',
                            width: 2
                        },
                        fill: {
                            fillColor: 'rgba(169,169,169, 0.2)',
                        }
                    }
                };
            case 'balloon':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fontSize: 16,
                            fillColor: '#000',
                            textBaseline: 'middle',
                            fontWeight: 'bold',
                            decoration: '',
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        fill: {
                            fillColor: 'rgba(255, 240, 200, 0.75)',
                        },
                        borderLine: {
                            strokeColor: '#f2be08',
                            width: 2
                        }
                    }
                };
            case 'arrowUp':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            textAlign: 'center',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#54C571',
                        },
                    }
                };
            case 'arrowDown':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            textAlign: 'center',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#ef5350'
                        }
                    }
                };
            case 'arrowLeft':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#54C571'
                        }
                    }
                };
            case 'arrowRight':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            textAlign: 'right',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#54C571'
                        }
                    }
                };
            case 'flag':
                return {
                    theme: {
                        fill: {
                            fillColor: '#54C571'
                        },
                        width: 2,
                    }
                };
            case 'volumeProfiler':
                return {
                    theme: {
                        line: {
                            strokeColor: '#FF0000',
                            width: 2,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(30,144,255,0.1)'
                        },
                        upVolume: {
                            fillColor: 'rgba(30,144,255,0.3)'
                        },
                        downVolume: {
                            fillColor: ' rgba(240,190,50,0.3)'
                        },
                        upArea: {
                            fillColor: 'rgba(30,144,255,0.75)'
                        },
                        downArea: {
                            fillColor: ' rgba(240,190,50,0.75)'
                        },
                        boxWidth: 30,
                        direction: 'left',
                        showBars: true,
                        rowSize: 24,
                        rowType: VolumeProfilerSettingsRowType.NUMBER_OF_ROWS,
                        valueAreaPercentage: 70
                    }
                };
        }
    };
    DrawingsDefaultSettings.getDrawingOriginalLightSettings = function (className) {
        switch (className) {
            case 'lineSegment':
            case 'trendChannel':
            case 'andrewsPitchfork':
            case 'tironeLevels':
            case 'quadrantLines':
            case 'errorChannel':
            case 'raffRegression':
            case 'oneOpenEndLineSegment':
            case 'twoOpenEndLineSegment':
            case 'arrowLineSegment':
            case 'angleLineSegment':
            case 'grid':
                return {
                    theme: {
                        line: {
                            strokeColor: '#555',
                            width: 1
                        }
                    }
                };
            case 'priceCalculation':
                return {
                    theme: {
                        line: {
                            strokeColor: '#295E8D',
                            width: 2
                        },
                        text: {
                            fontFamily: 'Arial',
                            fontSize: 14,
                            fontStyle: "bold",
                            fillColor: "#555",
                            textAlign: "center",
                            textVerticalAlign: "middle"
                        }
                    }
                };
            case 'abcdPattern':
                return {
                    theme: {
                        line: {
                            strokeColor: '#009b00',
                            width: 2,
                        }
                    }
                };
            case 'elliottTripleComboWave':
            case 'elliottDoubleComboWave':
                return {
                    theme: {
                        line: {
                            strokeColor: '#4b7539',
                            width: 2,
                        }
                    }
                };
            case 'elliottTriangleWave':
                return {
                    theme: {
                        line: {
                            strokeColor: '#b36b02',
                            width: 2,
                        }
                    }
                };
            case 'elliottImpulseWave':
            case 'elliottCorrectionWave':
                return {
                    theme: {
                        line: {
                            strokeColor: '#295e8d',
                            width: 2,
                        }
                    }
                };
            case 'threeDrivesPattern':
                return {
                    theme: {
                        line: {
                            strokeColor: '#9528ff',
                            width: 2,
                        }
                    }
                };
            case 'cyclicLines':
                return {
                    theme: {
                        line: {
                            strokeColor: '#87cefa',
                            width: 1,
                        },
                        dashedLine: {
                            strokeColor: '#555',
                            width: 1,
                            lineStyle: 'dash'
                        }
                    }
                };
            case 'crossLine':
            case 'verticalLine':
                return {
                    theme: {
                        line: {
                            strokeColor: '#555',
                            width: 1
                        },
                        labelText: {
                            fontFamily: 'Calibri',
                            fontSize: 12,
                            fillColor: '#555',
                            decoration: ''
                        }
                    }
                };
            case 'horizontalLine':
            case 'horizontalRay':
                return {
                    theme: {
                        line: {
                            strokeColor: '#555',
                            width: 1
                        },
                        text: {
                            fontFamily: 'DroidSansArabic',
                            fontSize: 14,
                            fillColor: 'green',
                            textAlign: "center",
                            textVerticalAlign: "bottom"
                        },
                    }
                };
            case 'trianglePattern':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(149,40,255)',
                            width: 1,
                        },
                        fill: {
                            fillColor: 'rgba(149,40,255, 0.5)',
                            fillEnabled: true
                        }
                    }
                };
            case 'circle':
            case 'ellipse':
            case 'rectangle':
            case 'rotatedRectangle':
            case 'triangle':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(153, 0, 0)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(255, 165, 0, 0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'parallelChannel':
            case 'band':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(153, 0, 0)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        middleLine: {
                            strokeColor: 'rgb(153, 0, 0)',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        fill: {
                            fillColor: 'rgba(255, 165, 0, 0.3)',
                            fillEnabled: true,
                        },
                        linesExtension: {
                            rightExtensionEnabled: false,
                            leftExtensionEnabled: false,
                        }
                    }
                };
            case 'arc':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(155,155,27)',
                            width: 2
                        },
                        fill: {
                            fillColor: 'rgba(155,155,27,0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'polyLine':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(60,60,60)',
                            width: 2,
                        },
                        fill: {
                            fillColor: 'rgba(70,100,190,0.4)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'flatTopBottom':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(73,133,231)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(70,100,190,0.4)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'timeCycles':
            case 'disjointAngle':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(48, 115, 45)',
                            width: 1,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(48, 111, 45 , 0.3)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'curve':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(34, 158, 135)',
                            width: 1
                        },
                        fill: {
                            fillColor: 'rgba(48, 111, 45 , 0.3)',
                            fillEnabled: false,
                        }
                    }
                };
            case 'brush':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(60,60,60)',
                            width: 3,
                        },
                        fill: {
                            fillColor: 'rgba(70,100,190,0.4)',
                            fillEnabled: false,
                        }
                    }
                };
            case 'headAndShoulders':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(69,104,47)',
                            width: 2,
                        },
                        fill: {
                            fillColor: 'rgba(81,165,21,0.6)',
                            fillEnabled: true
                        }
                    }
                };
            case 'cypherPattern':
            case 'xabcdPattern':
                return {
                    theme: {
                        line: {
                            strokeColor: 'rgb(204,40,149)',
                            width: 2,
                        },
                        fill: {
                            fillColor: 'rgba(204,40,149,0.4)',
                            fillEnabled: true,
                        }
                    }
                };
            case 'sineLine':
                return {
                    theme: {
                        line: {
                            strokeColor: '#008B8B',
                            width: 2
                        }
                    }
                };
            case 'fibonacciRetracements':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.0, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.272, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'black',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                                fillColor: 'black',
                                textAlign: 'right',
                            }
                        },
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                        reverse: false,
                        levelLinesExtension: FibonacciLevelLineExtension.NONE
                    }
                };
            case 'fibonacciProjection':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.272, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 2,
                                    lineStyle: 'dash'
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'black',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                        reverse: false,
                        levelLinesExtension: FibonacciLevelLineExtension.NONE
                    }
                };
            case 'fibonacciExtensions':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2,
                                    lineStyle: 'dot'
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.382, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1,
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.5, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.764, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.382, theme: {
                                line: {
                                    strokeColor: 'rgb(100, 100, 100)',
                                    width: 1,
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(100, 100, 100)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(100, 100, 100, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204 , 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.236, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 6.853, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 11.088, theme: {
                                line: {
                                    strokeColor: 'rgb(200, 200, 140)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(200, 200, 140)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 17.941, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(200, 200, 140, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 29.029, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'black',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                        reverse: false,
                        levelLinesExtension: FibonacciLevelLineExtension.NONE
                    }
                };
            case 'fibonacciEllipses':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.382, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.382, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.216, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 40, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 6.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 8.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'black',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.BOTTOM,
                        showLevelValues: true,
                        showLevelPercents: true,
                    }
                };
            case 'fibonacciSpeedResistanceArcs':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0.236, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 204, 149)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.786, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1.618, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(40, 40, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(204, 40, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3.618, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 40, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 40, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(149, 40, 204)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.236, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4.618, theme: {
                                line: {
                                    strokeColor: 'rgb(204, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(204, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(204, 40, 149)',
                                    fontStyle: 'normal',
                                    textAlign: "right",
                                    textBaseline: "middle",
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'rgb(128, 128, 128)',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        showFullCircle: false,
                        showLevelBackgrounds: true,
                        showLevelValues: true,
                    }
                };
            case 'fibonacciFan':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.33, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.37, theme: {
                                line: {
                                    strokeColor: 'rgb(149, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(149, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(149, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 204, 40)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 204, 40, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 204, 40)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.62, theme: {
                                line: {
                                    strokeColor: 'rgb(245, 40, 149)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(245, 40, 149, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(245, 40, 149)',
                                    fontStyle: 'normal'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.66, theme: {
                                line: {
                                    strokeColor: 'rgb(40, 149, 204)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(40, 149, 204, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(40, 149, 204)',
                                    fontStyle: 'normal'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'black',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        showLevelBackgrounds: true,
                        levelTextVerPosition: DrawingTextVerticalPosition.MIDDLE,
                        showLevelValues: true,
                        showLevelPrices: true,
                        showLevelPercents: true,
                    }
                };
            case 'fibonacciTimeZones':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 5, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 8, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 13, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 21, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 34, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 55, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 89, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 144, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 233, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 2
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        }
                    ],
                    theme: {
                        trendLine: {
                            strokeColor: 'black',
                            width: 1,
                            lineStyle: 'dash',
                            strokeEnabled: true
                        },
                        defaultTheme: {
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
                        levelTextHorPosition: DrawingTextHorizontalPosition.RIGHT,
                        levelTextVerPosition: DrawingTextVerticalPosition.BOTTOM,
                        showLevelValues: true,
                    }
                };
            case 'gannBox':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'right',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        }
                    ],
                    timeLevels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        }
                    ],
                    theme: {
                        angles: {
                            strokeColor: 'rgb(128,128,128)',
                            width: 1
                        },
                        reverse: false,
                        showTimeLevelBackground: true,
                        showPriceLevelBackground: true,
                        showBottomLabels: true,
                        showTopLabels: true,
                        showRightLabels: true,
                        showLeftLabels: true,
                        showAngles: false,
                    },
                };
            case 'fibonacciSpeedResistanceFan':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'right',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                }
                            }
                        }
                    ],
                    timeLevels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.25, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.382, theme: {
                                line: {
                                    strokeColor: 'rgb(154,205,50)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(154,205,50, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(154,205,50)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.5, theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.618, theme: {
                                line: {
                                    strokeColor: 'rgb(60,179,113)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(60,179,113, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(60,179,113)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 0.75, theme: {
                                line: {
                                    strokeColor: 'rgb(30,144,255)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(30,144,255, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(30,144,255)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle',
                                    textAlign: 'center',
                                }
                            }
                        }
                    ],
                    theme: {
                        grid: {
                            strokeEnabled: true,
                            strokeColor: 'rgb(128,128,128)',
                            width: 1,
                        },
                        showLevelBackgrounds: true,
                        showBottomLabels: true,
                        showTopLabels: true,
                        showRightLabels: true,
                        showLeftLabels: true,
                    }
                };
            case 'gannFan':
                return {
                    levels: [
                        {
                            visible: true,
                            value: '8/1', theme: {
                                line: {
                                    strokeColor: 'rgb(139,0,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(139,0,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(139,0,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '4/1', theme: {
                                line: {
                                    strokeColor: 'rgb(128,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,0,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '3/1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '2/1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/1', theme: {
                                line: {
                                    strokeColor: 'rgb(128,128,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,128,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(128,128,128)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/2', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,128,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,128,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,128,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/4', theme: {
                                line: {
                                    strokeColor: 'rgb(0,255,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,255,0, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(0,255,0)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1/8', theme: {
                                line: {
                                    strokeColor: 'rgb(139,69,19)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(139,69,19, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 14,
                                    fillColor: 'rgb(139,69,19)',
                                    fontStyle: 'normal',
                                    textBaseline: 'middle'
                                }
                            }
                        },
                    ],
                    theme: {
                        showLevelBackgrounds: true,
                        showLevelValues: true,
                    }
                };
            case 'gannSquare':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                },
                            },
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3, theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4, theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 5, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    fans: [
                        {
                            visible: false,
                            value: '1 * 8', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(128,0,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,0,0, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128,0,0)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '2 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: false,
                            value: '3 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '4 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '5 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(75,0,130)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(75,0,130, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(75,0,130)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '8 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                    ],
                    arcs: [
                        {
                            visible: true,
                            value: '0 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 *1.5', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 14,
                            fillColor: 'rgb(128, 128, 128)',
                        },
                        showLevelBackgrounds: true,
                        reverse: false,
                        showText: true,
                    },
                };
            case 'gannSquareFixed':
                return {
                    levels: [
                        {
                            visible: true,
                            value: 0, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                },
                            },
                        },
                        {
                            visible: true,
                            value: 1, theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 2, theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 3, theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 4, theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: 5, theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    fans: [
                        {
                            visible: false,
                            value: '1 * 8', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(128,0,0)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128,0,0, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128,0,0)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(128, 128, 128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(128, 128, 128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(128, 128, 128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '2 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: false,
                            value: '3 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '4 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '5 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(75,0,130)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(75,0,130, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(75,0,130)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                        {
                            visible: false,
                            value: '8 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(148,0,211)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(148,0,211, 0)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(148,0,211)',
                                    fontStyle: 'bold'
                                }
                            },
                        },
                    ],
                    arcs: [
                        {
                            visible: true,
                            value: '0 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 1', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 1.5', theme: {
                                line: {
                                    strokeColor: 'rgb(184,134,11)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(184,134,11, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(184,134,11)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 2', theme: {
                                line: {
                                    strokeColor: 'rgb(107,142,35)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(107,142,35, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(107,142,35)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 3', theme: {
                                line: {
                                    strokeColor: 'rgb(0,175,51)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,175,51, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,175,51)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 4', theme: {
                                line: {
                                    strokeColor: 'rgb(32,178,170)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(32,178,170, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(32,178,170)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '0 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                        {
                            visible: true,
                            value: '1 * 5', theme: {
                                line: {
                                    strokeColor: 'rgb(0,0,128)',
                                    width: 1
                                },
                                fill: {
                                    fillColor: 'rgba(0,0,128, 0.2)'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 12,
                                    fillColor: 'rgb(0,0,128)',
                                    fontStyle: 'bold'
                                }
                            }
                        },
                    ],
                    theme: {
                        showLevelBackgrounds: true,
                        reverse: false,
                    },
                };
            case 'textAnchored':
            case 'text':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fontSize: 20,
                            fillColor: '#000',
                            textAlign: 'center',
                            textBaseline: 'top',
                            decoration: '',
                            textBackgroundEnabled: false,
                            textBorderEnabled: false,
                            textWrapEnabled: false,
                        },
                        fill: {
                            fillColor: 'rgba(255, 165, 0, 0.3)',
                        },
                        borderLine: {
                            strokeColor: 'rgb(153, 0, 0)',
                            width: 1
                        }
                    }
                };
            case 'image':
                return {
                    theme: {
                        noImage: {
                            line: {
                                strokeColor: '#ff0000',
                                width: 1
                            }
                        }
                    }
                };
            case 'noteAnchored':
            case 'note':
                return {
                    theme: {
                        text: {
                            fillColor: '#000000',
                            fontFamily: 'Arial',
                            fontSize: 20,
                            textAlign: 'right',
                            textBaseline: 'bottom',
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        borderLine: {
                            strokeColor: '#005cb7',
                            width: 1
                        },
                        fill: {
                            fillColor: 'rgb(255,255,255)'
                        }
                    }
                };
            case 'callout':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            fillColor: '#FFFFFF',
                            fontSize: 16,
                            textBaseline: 'top',
                            textAlign: 'center',
                            textWrapEnabled: false,
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        borderLine: {
                            strokeColor: '#800000',
                            width: 2
                        },
                        fill: {
                            fillColor: 'rgba(128,0,0, 0.5)',
                        }
                    }
                };
            case 'priceLabel':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fillColor: '#000',
                            fontSize: 14,
                            fontWeight: 'bold',
                            textBaseline: 'middle',
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        borderLine: {
                            strokeColor: '#ff8000',
                            width: 2
                        },
                        fill: {
                            fillColor: 'rgba(255,128,0, 0.1)',
                        }
                    }
                };
            case 'balloon':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Arial',
                            fontSize: 16,
                            fillColor: '#000',
                            textBaseline: 'middle',
                            fontWeight: 'bold',
                            decoration: '',
                            textBackgroundEnabled: true,
                            textBorderEnabled: true
                        },
                        fill: {
                            fillColor: 'rgba(255, 240, 200, 0.75)',
                        },
                        borderLine: {
                            strokeColor: '#f2be08',
                            width: 2
                        }
                    }
                };
            case 'arrowUp':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            textAlign: 'center',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#006400',
                        },
                    }
                };
            case 'arrowDown':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            textAlign: 'center',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#8B0000'
                        }
                    }
                };
            case 'arrowLeft':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#006400'
                        }
                    }
                };
            case 'arrowRight':
                return {
                    theme: {
                        text: {
                            fontFamily: 'Calibri',
                            fillColor: '#696969',
                            textAlign: 'right',
                            fontSize: 20,
                        },
                        fill: {
                            fillColor: '#006400'
                        }
                    }
                };
            case 'flag':
                return {
                    theme: {
                        fill: {
                            fillColor: '#006400'
                        },
                        width: 2,
                    }
                };
            case 'volumeProfiler':
                return {
                    theme: {
                        line: {
                            strokeColor: '#FF0000',
                            width: 2,
                            strokeEnabled: true,
                        },
                        fill: {
                            fillColor: 'rgba(30,144,255,0.1)'
                        },
                        upVolume: {
                            fillColor: 'rgba(30,144,255,0.3)'
                        },
                        downVolume: {
                            fillColor: ' rgba(240,190,50,0.3)'
                        },
                        upArea: {
                            fillColor: 'rgba(30,144,255,0.75)'
                        },
                        downArea: {
                            fillColor: ' rgba(240,190,50,0.75)'
                        },
                        boxWidth: 30,
                        direction: 'left',
                        showBars: true,
                        rowSize: 24,
                        rowType: VolumeProfilerSettingsRowType.NUMBER_OF_ROWS,
                        valueAreaPercentage: 70
                    }
                };
        }
    };
    DrawingsDefaultSettings.savedDefaultSettings = null;
    return DrawingsDefaultSettings;
}());
export { DrawingsDefaultSettings };
//# sourceMappingURL=DrawingsDefaultSettings.js.map