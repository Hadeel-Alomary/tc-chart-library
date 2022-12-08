import { Const } from "./TASdk";
var Field = (function () {
    function Field() {
        this._m_values = [];
        this.recordCount = 0;
    }
    Field.prototype.initialize = function (iRecordCount, sName) {
        this.name = sName;
        this.recordCount = iRecordCount;
        this._m_values = new Array(iRecordCount + 1);
        for (var n = 0; n < this._m_values.length; n++) {
            this._m_values[n] = 0;
        }
    };
    Field.prototype.setValue = function (iIndex, value) {
        this._m_values[iIndex] = value;
    };
    Field.prototype.value = function (iIndex) {
        if (iIndex > 0 && iIndex < this._m_values.length) {
            return this._m_values[iIndex];
        }
        return Const.nullValue;
    };
    return Field;
}());
export { Field };
//# sourceMappingURL=Field.js.map