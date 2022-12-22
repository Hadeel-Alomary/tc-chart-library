/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


export interface IDestroyable {
    destroy(): void;
}

export interface IComponent extends IDestroyable {

}

/**
 * Represents abstract chart component (non-visual control).
 * @constructor Component
 * @abstract
 */
/**
 * Destroys and removes control from the parent element.
 * @method destroy
 * @memberOf Component#
 */
export abstract class Component implements IComponent {
    abstract destroy(): void;
}
