/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Drawing, IDrawingOptions} from '../Drawing';
import {TextDrawingsBase} from './TextDrawingsBase';


export interface ITextDrawingOptions extends IDrawingOptions {
    textWrapWidth: number;
}


/**
 * Represent text drawing
 * @param {object} [config] The configuration object.
 * @constructor TextDrawing
 * @augments Drawing
 * @example
 *  // Create text drawing.
 *  var text1 = new TextDrawing({
 *      point: {x: 10, y: 20},
 *      text: 'some text'
 *  });
 *
 *  // Create text drawing.
 *  var text2 = new TextDrawing({
 *      point: {record: 10, value: 20.0},
 *      text: 'some text'
 *  });
 *
 *  // Create text drawing with a custom theme.
 *  var text3 = new TextDrawing({
 *      point: {record: 10, value: 20.0},
 *      theme: {
 *          text: {
 *              fontFamily: 'Arial'
 *              fontSize: 14,
 *              fillColor: 'white'
 *          },
 *      },
 *      text: 'some text'
 *  });
 */
export class TextDrawing extends TextDrawingsBase {
    static get className(): string {
        return 'text';
    }

}

Drawing.register(TextDrawing);

