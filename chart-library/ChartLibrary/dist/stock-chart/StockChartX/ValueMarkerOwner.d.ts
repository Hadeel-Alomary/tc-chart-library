export interface ValueMarkerOwner {
    top: number;
    valueMarkerOffset: number;
}
export declare class ValueMarkerOwnerOperations {
    private static valueMarkerHeight;
    static isOverlapping(owner: ValueMarkerOwner, other: ValueMarkerOwner, isTop: boolean): boolean;
    static overlapValue(owner: ValueMarkerOwner, other: ValueMarkerOwner): number;
    private static compare;
    static sort(owners: ValueMarkerOwner[], descending: boolean): void;
    static clearValueMarkerOffsets(owners: ValueMarkerOwner[]): void;
    static setValueMarkerOffsets(referenceValueMarker: ValueMarkerOwner, valueMarkerOwners: ValueMarkerOwner[], isTop: boolean): void;
    static fixValueMarkersOverlapping(referenceValueMarker: ValueMarkerOwner, owners: ValueMarkerOwner[]): void;
}
//# sourceMappingURL=ValueMarkerOwner.d.ts.map