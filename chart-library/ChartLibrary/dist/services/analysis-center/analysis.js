var Analyzer = (function () {
    function Analyzer(name, nickName) {
        this.name = name;
        this.nickName = nickName;
    }
    Analyzer.AllAnalyzers = function () {
        return Analyzer.allAnalyzers;
    };
    Analyzer.allAnalyzers = new Analyzer('جميع المحللين', 'all');
    return Analyzer;
}());
export { Analyzer };
//# sourceMappingURL=analysis.js.map