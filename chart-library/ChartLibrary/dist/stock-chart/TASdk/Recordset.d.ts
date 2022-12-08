import { Field } from './Field';
export declare class Recordset {
    private _m_FieldNav;
    addField(newField: Field): void;
    getIndex(sFieldName: string): number;
    renameField(sOldFieldName: string, sNewFieldName: string): void;
    removeField(sFieldName: string): void;
    value(sFieldName: string, iRowIndex: number): number;
    getField(sFieldName: string): Field;
    getFieldByIndex(iIndex: number): Field;
    copyField(f: Field, sFieldName: string): void;
    getName(iFieldIndex: number): string;
}
//# sourceMappingURL=Recordset.d.ts.map