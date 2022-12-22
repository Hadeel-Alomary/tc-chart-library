/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Drawing, IDrawingConfig, IDrawingOptions, IDrawingState} from '../Drawing';
import {IRect} from "../../Graphics/Rect";
import {IPoint} from "../../Graphics/ChartPoint";
import {Geometry} from "../../Graphics/Geometry";
import {ViewLoaderType, ChartAccessorService} from "../../../../services/index";
import {ThemedDrawing} from '../ThemedDrawing';
import {ImageDrawingTheme} from '../DrawingThemeTypes';
import {Chart} from '../../Chart';


export interface IImageDrawingConfig extends IDrawingConfig {
    url: string;
}

export interface IImageDrawingOptions extends IDrawingOptions {
    url: string;
}

/** 
 * Drawing events enumeration values. 
 * @name DrawingEvent 
 * @enum {string} 
 * @property {string} URL_CHANGED Image URL changed
 * @readonly 
 * @memberOf  
 */
export namespace DrawingEvent {
    export const URL_CHANGED = 'drawingUrlChanged';
}

const NoImageSize = {
    width: 10,
    height: 10
};

/**
 * Represents image drawing.
 * @param {object} [config] The configuration object.
 * @param {string} [config.url] The image url.
 * @constructor ImageDrawing
 * @augments Drawing
 * @example
 *  // Create image drawing.
 *  var image1 = new ImageDrawing({
     *      point: {x: 10, y: 20},
     *      url: 'img/image.png'
     *  });
 *
 *  // Create image drawing.
 *  var image2 = new ImageDrawing({
     *      point: {record: 10, value: 20.0},
     *      url: 'http://wwww.server.com/img/image.png
     *  });
 */
export class ImageDrawing extends ThemedDrawing<ImageDrawingTheme> {
    static get className(): string {
        return 'image';
    }

    private _image = new Image();

    /**
     * Gets/Sets image url.
     * @name url
     * @type {string}
     * @memberOf ImageDrawing#
     */
    get url(): string {
        return (<IImageDrawingOptions> this._options).url || '';
    }

    set url(value) {
        this._setOption('url', value, DrawingEvent.URL_CHANGED);
        this._image.src = value;
    }

    constructor(chart:Chart, config?: IImageDrawingConfig) {
        super(chart, config);

        this.url = config && config.url;
        this.loadImage();
    }

    loadState(state: IDrawingState) {
        super.loadState(state);
        if(this.url){
            this._image.src = this.url;
        }
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        return {
            left: point.x,
            top: point.y,
            width: this._image.width || NoImageSize.width,
            height: this._image.height || NoImageSize.height
        };
    }

    private _markerPoints(point: IPoint): IPoint | IPoint[] {
        if (!point)
            point = this.cartesianPoint(0);

        let image = this._image,
            x = point.x,
            y = point.y;

        if (image.width > 0) {
            return [
                point,
                {
                    x: x + image.width,
                    y: y
                },
                {
                    x: x + image.width,
                    y: y + image.height
                },
                {
                    x: x,
                    y: y + image.height
                }];
        }

        return {
            x: Math.round(x + NoImageSize.width / 2),
            y: Math.round(y + NoImageSize.height / 2)
        }
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.showSettingsDialog();
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let bounds = this.bounds();

        return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint(0);
        if (!point)
            return;

        let theme = this.getDrawingTheme();

        let context = this.context,
            x = point.x,
            y = point.y;

        if (this._image.width > 0) {
            context.drawImage(this._image, x, y);
        }

        if (this.selected)
            this._drawSelectionMarkers(this._markerPoints(point));
    }


    private loadImage() {
        this._image.onload = () => {
            let panel = this.chartPanel;

            if (panel)
                panel.setNeedsUpdate();
        };
        if(this.url) {
            this._image.src = this.url;
        }
    }

}

Drawing.register(ImageDrawing);
