export interface ValueMarkerOwner {
    top: number,
    valueMarkerOffset: number
}

export class ValueMarkerOwnerOperations {

    private static valueMarkerHeight: number = 13;

    public static isOverlapping(owner: ValueMarkerOwner, other: ValueMarkerOwner, isTop: boolean): boolean {
        let otherTopAndOffset = other.top + other.valueMarkerOffset;
        return (!isTop && otherTopAndOffset >= owner.top) ||
               (isTop && owner.top >= otherTopAndOffset) ||
               (owner.top >= otherTopAndOffset && owner.top <= otherTopAndOffset + ValueMarkerOwnerOperations.valueMarkerHeight) ||
               (otherTopAndOffset >= owner.top && otherTopAndOffset <= owner.top + ValueMarkerOwnerOperations.valueMarkerHeight)
    }

    public static overlapValue(owner: ValueMarkerOwner, other: ValueMarkerOwner): number {
        return (other.top + ValueMarkerOwnerOperations.valueMarkerHeight) - owner.top
    }

    private static compare(owner: ValueMarkerOwner, other: ValueMarkerOwner) {
        if (owner.top > other.top)
            return 1;
        if (owner.top < other.top)
            return -1;
        return 0;
    }

    public static sort(owners: ValueMarkerOwner[], descending: boolean) {
        owners.sort(ValueMarkerOwnerOperations.compare);
        if (descending)
            owners.reverse()
    }

    public static clearValueMarkerOffsets(owners: ValueMarkerOwner[]) {
        for(let owner of owners) {
            owner.valueMarkerOffset = 0;
        }
    }

    public static setValueMarkerOffsets(referenceValueMarker: ValueMarkerOwner, valueMarkerOwners: ValueMarkerOwner[], isTop: boolean) {
        let owners: ValueMarkerOwner[] = [].concat(referenceValueMarker, valueMarkerOwners);

        ValueMarkerOwnerOperations.sort(owners, isTop);
        ValueMarkerOwnerOperations.clearValueMarkerOffsets(owners);

        for(let i = 1; i < owners.length; i++) {
            let owner = owners[i];
            let previousOwner = owners[i - 1];

            if(ValueMarkerOwnerOperations.isOverlapping(owner, previousOwner, isTop)) {
                if(isTop) {
                    let shiftValue = ValueMarkerOwnerOperations.overlapValue(previousOwner, owner) - previousOwner.valueMarkerOffset + 4;
                    owner.valueMarkerOffset = -shiftValue;
                } else {
                    let shiftValue = ValueMarkerOwnerOperations.overlapValue(owner, previousOwner) + previousOwner.valueMarkerOffset + 4;
                    owner.valueMarkerOffset = shiftValue;
                }
            }
        }
    }

    public static fixValueMarkersOverlapping(referenceValueMarker: ValueMarkerOwner, owners: ValueMarkerOwner[]) {
        if(owners.length == 0) { return; } // no markers, so nothing to fix ;-)
        let topOwners = owners.filter(owner => owner.top <  referenceValueMarker.top);
        let bottomOwners = owners.filter(owner => owner.top >=  referenceValueMarker.top);

        ValueMarkerOwnerOperations.setValueMarkerOffsets(referenceValueMarker, topOwners, true);
        ValueMarkerOwnerOperations.setValueMarkerOffsets(referenceValueMarker, bottomOwners, false);
    }
}
