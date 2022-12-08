var ValueMarkerOwnerOperations = (function () {
    function ValueMarkerOwnerOperations() {
    }
    ValueMarkerOwnerOperations.isOverlapping = function (owner, other, isTop) {
        var otherTopAndOffset = other.top + other.valueMarkerOffset;
        return (!isTop && otherTopAndOffset >= owner.top) ||
            (isTop && owner.top >= otherTopAndOffset) ||
            (owner.top >= otherTopAndOffset && owner.top <= otherTopAndOffset + ValueMarkerOwnerOperations.valueMarkerHeight) ||
            (otherTopAndOffset >= owner.top && otherTopAndOffset <= owner.top + ValueMarkerOwnerOperations.valueMarkerHeight);
    };
    ValueMarkerOwnerOperations.overlapValue = function (owner, other) {
        return (other.top + ValueMarkerOwnerOperations.valueMarkerHeight) - owner.top;
    };
    ValueMarkerOwnerOperations.compare = function (owner, other) {
        if (owner.top > other.top)
            return 1;
        if (owner.top < other.top)
            return -1;
        return 0;
    };
    ValueMarkerOwnerOperations.sort = function (owners, descending) {
        owners.sort(ValueMarkerOwnerOperations.compare);
        if (descending)
            owners.reverse();
    };
    ValueMarkerOwnerOperations.clearValueMarkerOffsets = function (owners) {
        for (var _i = 0, owners_1 = owners; _i < owners_1.length; _i++) {
            var owner = owners_1[_i];
            owner.valueMarkerOffset = 0;
        }
    };
    ValueMarkerOwnerOperations.setValueMarkerOffsets = function (referenceValueMarker, valueMarkerOwners, isTop) {
        var owners = [].concat(referenceValueMarker, valueMarkerOwners);
        ValueMarkerOwnerOperations.sort(owners, isTop);
        ValueMarkerOwnerOperations.clearValueMarkerOffsets(owners);
        for (var i = 1; i < owners.length; i++) {
            var owner = owners[i];
            var previousOwner = owners[i - 1];
            if (ValueMarkerOwnerOperations.isOverlapping(owner, previousOwner, isTop)) {
                if (isTop) {
                    var shiftValue = ValueMarkerOwnerOperations.overlapValue(previousOwner, owner) - previousOwner.valueMarkerOffset + 4;
                    owner.valueMarkerOffset = -shiftValue;
                }
                else {
                    var shiftValue = ValueMarkerOwnerOperations.overlapValue(owner, previousOwner) + previousOwner.valueMarkerOffset + 4;
                    owner.valueMarkerOffset = shiftValue;
                }
            }
        }
    };
    ValueMarkerOwnerOperations.fixValueMarkersOverlapping = function (referenceValueMarker, owners) {
        if (owners.length == 0) {
            return;
        }
        var topOwners = owners.filter(function (owner) { return owner.top < referenceValueMarker.top; });
        var bottomOwners = owners.filter(function (owner) { return owner.top >= referenceValueMarker.top; });
        ValueMarkerOwnerOperations.setValueMarkerOffsets(referenceValueMarker, topOwners, true);
        ValueMarkerOwnerOperations.setValueMarkerOffsets(referenceValueMarker, bottomOwners, false);
    };
    ValueMarkerOwnerOperations.valueMarkerHeight = 13;
    return ValueMarkerOwnerOperations;
}());
export { ValueMarkerOwnerOperations };
//# sourceMappingURL=ValueMarkerOwner.js.map