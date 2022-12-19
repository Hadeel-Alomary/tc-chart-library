var TechnicalIndicatorColumns = (function () {
    function TechnicalIndicatorColumns(colName, topic) {
        this.colName = colName;
        this.topic = topic;
    }
    TechnicalIndicatorColumns.getAllColumns = function () {
        if (TechnicalIndicatorColumns.allColumns) {
            return TechnicalIndicatorColumns.allColumns;
        }
        TechnicalIndicatorColumns.allColumns = [];
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('issuedshares', 'ISSUEDSHARES_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('freeshares', 'FREESHARES_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('pivot', 'PIVOT_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('range', 'RANGE_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support1', 'SUPPORT1_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support2', 'SUPPORT2_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support3', 'SUPPORT3_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support4', 'SUPPORT4_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance1', 'RESISTANCE1_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance2', 'RESISTANCE2_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance3', 'RESISTANCE3_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance4', 'RESISTANCE4_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('phigh', 'HIGH_1day_pt1'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('plow', 'LOW_1day_pt1'));
        return TechnicalIndicatorColumns.allColumns;
    };
    TechnicalIndicatorColumns.getColNameByTopic = function (topic) {
        var col = TechnicalIndicatorColumns.getAllColumns().find(function (item) { return item.topic == topic; });
        if (col) {
            return col.colName;
        }
        return '';
    };
    TechnicalIndicatorColumns.getColumn = function (columnName) {
        var column = TechnicalIndicatorColumns.getAllColumns().find(function (item) { return item.colName == columnName; });
        if (column) {
            return column;
        }
        return null;
    };
    return TechnicalIndicatorColumns;
}());
export { TechnicalIndicatorColumns };
//# sourceMappingURL=technical-indicator-columns.js.map