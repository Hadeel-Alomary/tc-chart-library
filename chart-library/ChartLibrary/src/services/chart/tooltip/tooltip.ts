
export interface ChartTooltip{
    show(config:ChartTooltipConfig):void;
    hide():void;
    getType():ChartTooltipType;
}

export enum ChartTooltipType {
    Price = 1,
    Indicator,
    Drawing,
    Split,
    Trading,
    News,
    Alert
}

export interface ChartTooltipConfig{}

export interface ChartTooltipDataAndPositionConfig{}
