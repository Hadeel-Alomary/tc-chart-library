var Dictionary = (function () {
    function Dictionary(init) {
        this._length = 0;
        this._list = {};
        if (init != null) {
            for (var _i = 0, init_1 = init; _i < init_1.length; _i++) {
                var pair = init_1[_i];
                this.add(pair.key, pair.value);
            }
        }
    }
    Dictionary.prototype.add = function (key, value) {
        if (this.containsKey(key))
            throw new Error("Such key already exists");
        this._list[key] = value;
        this._length++;
    };
    Dictionary.prototype.remove = function (key) {
        if (!this.containsKey(key))
            return false;
        delete this._list[key];
        this._length--;
        return true;
    };
    Dictionary.prototype.length = function () {
        return this._length;
    };
    Dictionary.prototype.containsKey = function (key) {
        return typeof this._list[key] !== "undefined";
    };
    Dictionary.prototype.tryGet = function (key) {
        return this.containsKey(key) ? this._list[key] : null;
    };
    return Dictionary;
}());
export { Dictionary };
//# sourceMappingURL=Dictionary.js.map