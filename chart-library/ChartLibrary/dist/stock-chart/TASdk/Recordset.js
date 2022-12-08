import { Field } from './Field';
var Recordset = (function () {
    function Recordset() {
        this._m_FieldNav = [];
    }
    Recordset.prototype.addField = function (newField) {
        this._m_FieldNav.push(newField);
    };
    Recordset.prototype.getIndex = function (sFieldName) {
        for (var i = 0; i < this._m_FieldNav.length; i++) {
            if (this._m_FieldNav[i].name === sFieldName) {
                return i;
            }
        }
        return -1;
    };
    Recordset.prototype.renameField = function (sOldFieldName, sNewFieldName) {
        var iIndex = this.getIndex(sOldFieldName);
        if (iIndex !== -1) {
            this._m_FieldNav[iIndex].name = sNewFieldName;
        }
    };
    Recordset.prototype.removeField = function (sFieldName) {
        var iIndex = this.getIndex(sFieldName);
        if (iIndex !== -1) {
            this._m_FieldNav.splice(iIndex, 1);
        }
    };
    Recordset.prototype.value = function (sFieldName, iRowIndex) {
        var iIndex = this.getIndex(sFieldName);
        if (iIndex !== -1) {
            return this._m_FieldNav[iIndex].value(iRowIndex);
        }
        return -1;
    };
    Recordset.prototype.getField = function (sFieldName) {
        var iIndex = this.getIndex(sFieldName);
        if (iIndex !== -1) {
            return this._m_FieldNav[iIndex];
        }
        return new Field();
    };
    Recordset.prototype.getFieldByIndex = function (iIndex) {
        if (iIndex !== -1 && iIndex < this._m_FieldNav.length) {
            return this._m_FieldNav[iIndex];
        }
        return new Field();
    };
    Recordset.prototype.copyField = function (f, sFieldName) {
        var iIndex = this.getIndex(sFieldName);
        if (iIndex === -1) {
            return;
        }
        var src = this._m_FieldNav[iIndex];
        var iRecordCount = src.recordCount;
        for (var iRec = 1; iRec < iRecordCount + 1; iRec++) {
            f.setValue(iRec, src.value(iRec));
        }
    };
    Recordset.prototype.getName = function (iFieldIndex) {
        if (iFieldIndex >= 0 && iFieldIndex < this._m_FieldNav.length) {
            return this._m_FieldNav[iFieldIndex].name;
        }
        return '';
    };
    return Recordset;
}());
export { Recordset };
//# sourceMappingURL=Recordset.js.map