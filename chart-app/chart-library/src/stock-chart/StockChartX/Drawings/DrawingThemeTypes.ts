import {VolumeProfilerSettingsRowType} from "../../../services";

export interface DrawingTheme {
}

export interface LineDrawingTheme extends DrawingTheme {
    line: LineThemeElement
}

export interface CyclicLinesDrawingTheme extends DrawingTheme {
    line:LineThemeElement,
    dashedLine:LineThemeElement
}


export interface LineWithLabelDrawingTheme extends DrawingTheme {
    line:LineThemeElement,
    labelText: TextThemeElement
}

export interface LineWithTextDrawingTheme extends DrawingTheme {
    line:LineThemeElement,
    text: TextThemeElement
}

export interface FilledShapeDrawingTheme extends DrawingTheme {
    line:LineThemeElement,
    fill:FillThemeElement
}

export interface FibonacciExtendedLevelsDrawingTheme extends DrawingTheme {
    trendLine: LineThemeElement,
    defaultTheme: LevelThemeElement,
    showLevelBackgrounds:boolean,
    levelTextHorPosition: string,
    levelTextVerPosition: string,
    showLevelValues: boolean,
    showLevelPrices: boolean,
    showLevelPercents: boolean,
    reverse: boolean,
    levelLinesExtension: string
}

export interface ParallelChanelDrawingTheme extends DrawingTheme {
    line: LineThemeElement,
    middleLine: LineThemeElement,
    fill: FillThemeElement,
    linesExtension: LineExtensionTheme
}

export interface FibonacciEllipsesDrawingTheme extends DrawingTheme {
    trendLine: LineThemeElement,
    defaultTheme:LevelThemeElement,
    showLevelBackgrounds:boolean,
    levelTextHorPosition: string,
    levelTextVerPosition: string,
    showLevelValues: boolean,
    showLevelPercents: boolean
}




export interface FibonacciFanDrawingTheme extends DrawingTheme {
    trendLine: LineThemeElement,
    defaultTheme:LevelThemeElement,
    showLevelBackgrounds:boolean,
    levelTextVerPosition: string,
    showLevelValues: boolean,
    showLevelPrices: boolean,
    showLevelPercents: boolean,
}

export interface FibonacciTimeZonesDrawingTheme extends DrawingTheme {
    trendLine: LineThemeElement,
    defaultTheme: LevelThemeElement,
    levelTextHorPosition: string,
    levelTextVerPosition: string,
    showLevelValues: boolean,
}

export interface FibonacciSpeedResistanceArcsDrawingTheme extends DrawingTheme {
    trendLine: LineThemeElement,
    showFullCircle:boolean,
    showLevelBackgrounds:boolean,
    showLevelValues: boolean,
}





export interface GannBoxDrawingTheme extends DrawingTheme {
    angles: LineThemeElement,
    reverse: boolean,
    showTimeLevelBackground:boolean,
    showPriceLevelBackground:boolean,
    showBottomLabels:boolean,
    showTopLabels:boolean,
    showRightLabels:boolean,
    showLeftLabels:boolean,
    showAngles:boolean
}

export interface FibonacciSpeedResistanceFanDrawingTheme extends DrawingTheme {
    grid: LineThemeElement,
    showLevelBackgrounds:true,
    showBottomLabels:true,
    showTopLabels:true,
    showRightLabels:true,
    showLeftLabels:true
}

export interface GannFanDrawingTheme extends DrawingTheme {
    showLevelBackgrounds:boolean,
    showLevelValues: boolean
}

export interface GannSquareDrawingTheme extends DrawingTheme {
    text: TextThemeElement, // MA decoration is missing in theme
    showLevelBackgrounds:boolean,
    reverse:boolean,
    showText:boolean
}

export interface GannSquareFixedDrawingTheme extends DrawingTheme {
    showLevelBackgrounds:boolean,
    reverse:boolean
}

export interface BorderedTextDrawingTheme extends DrawingTheme {
    text: BorderedTextThemeElement,
    fill: FillThemeElement,
    borderLine: LineThemeElement
}

export interface ArrowDrawingTheme extends DrawingTheme {
    text: TextThemeElement,
    fill: FillThemeElement
}

export interface FlagDrawingTheme extends DrawingTheme {
    fill: FillThemeElement,
    width: number
}


export interface ImageDrawingTheme extends DrawingTheme {
    noImage: {
        line: LineThemeElement
    }
}

export interface VolumeProfilerDrawingTheme extends DrawingTheme {
    line: LineThemeElement,
    upVolume:FillColorThemeElement,
    downVolume:FillColorThemeElement,
    upArea:FillColorThemeElement,
    downArea:FillColorThemeElement,
    fill:FillColorThemeElement,
    direction:string,
    showBars:boolean,
    boxWidth:number,
    rowSize:number,
    rowType:VolumeProfilerSettingsRowType,
    valueAreaPercentage:number
}


/* Theme Elements */

export interface DrawingThemeElement {
}

export interface LineThemeElement extends DrawingThemeElement {
    strokeColor:string,
    width:number,
    lineStyle?:string,
    strokeEnabled?:boolean
}

export interface TextThemeElement extends DrawingThemeElement {
    fontFamily: string,
    fontSize: number,
    fillColor: string,
    decoration: string,
    textAlign?:string,
    textVerticalAlign?:string,
    fontStyle?:string
}

export interface BorderedTextThemeElement extends TextThemeElement {
    textBaseline:string,
    textBackgroundEnabled:boolean,
    textBorderEnabled:boolean,
    textWrapEnabled:boolean,
}


export interface TextBoxThemeElement extends DrawingThemeElement {
    fontFamily: string,
    fontSize: number,
    fillColor: string,
    decoration: string,
    textBaseline: string,
    textBackgroundEnabled:boolean,
    textBorderEnabled:boolean,
    textWrapEnabled:boolean,
    textAlign:string,
    fontStyle:string,
    fontWeight:string,
}

export interface FillThemeElement extends DrawingThemeElement {
    fillColor: string,
    fillEnabled: boolean
}

export interface FillColorThemeElement extends DrawingThemeElement {
    fillColor: string,
}

export interface LineExtensionTheme extends DrawingTheme{
    rightExtensionEnabled: boolean,
    leftExtensionEnabled: boolean,
}

export interface LevelTextThemeElement extends DrawingThemeElement{
    fontFamily: string,
    fontSize: number,
    fillColor: string,
    fontStyle: string,
    textAlign?:string,
    textBaseline?:string
}

export interface LevelThemeElement extends DrawingThemeElement {
    line: {
        strokeColor: string,
        width: number,
        lineStyle?:string
    },
    fill: {
        fillColor:string
    },
    text: LevelTextThemeElement
}




