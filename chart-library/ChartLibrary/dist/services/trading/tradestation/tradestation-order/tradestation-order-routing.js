var TradestationOrderRouting = (function () {
    function TradestationOrderRouting(value, name) {
        this.value = value;
        this.name = name;
    }
    TradestationOrderRouting.getAllTypes = function () {
        if (!TradestationOrderRouting.allTypes) {
            TradestationOrderRouting.allTypes = [];
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.Intelligent, 'Intelligent'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.AMEX, 'AMEX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.ARCX, 'ARCX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.BATS, 'BATS'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.BYX, 'BYX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.CSFB, 'CSFB'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.EDGA, 'EDGA'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.G1X, 'G1X'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.IEX, 'IEX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.KCG, 'Knight Link'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.NQBX, 'NQBX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.NSDQ, 'NSDQ'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.NYSE, 'NYSE'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.POV, 'POV-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.SSC, 'SSC'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.TWAP, 'TWAP-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.VWAP, 'VWAP-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.WEEP, 'SweepPI-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.WEES, 'Sweep-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.WEXP, 'SweepPI-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.WEXS, 'Sweep-ALGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.XNDQ, 'XNDQ'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.PHLX, 'PHLX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.NYOP, 'NYSE Arca'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.MCRY, 'ISE Mercury'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.MIAX, 'MIAX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.MPRL, 'MPRL'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.NOBO, 'Nasdaq BX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.ISE, 'ISE'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.GMNI, 'GMNI'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.EMLD, 'EMLD'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.EDGO, 'EDGO'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.C2, 'C2'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.CBOE, 'CBOE'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.BOX, 'BOX'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.BAOP, 'BATS'));
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.AMOP, 'NYSE Amex'));
        }
        return TradestationOrderRouting.allTypes;
    };
    TradestationOrderRouting.getOrderRoutingByType = function (value) {
        return TradestationOrderRouting.getAllTypes().find(function (item) { return item.value == value; });
    };
    return TradestationOrderRouting;
}());
export { TradestationOrderRouting };
export var TradestationOrderRoutingType;
(function (TradestationOrderRoutingType) {
    TradestationOrderRoutingType["Intelligent"] = "Intelligent";
    TradestationOrderRoutingType["AMEX"] = "AMEX";
    TradestationOrderRoutingType["ARCX"] = "ARCX";
    TradestationOrderRoutingType["BATS"] = "BATS";
    TradestationOrderRoutingType["BYX"] = "BYX";
    TradestationOrderRoutingType["CSFB"] = "CSFB";
    TradestationOrderRoutingType["EDGA"] = "EDGA";
    TradestationOrderRoutingType["G1X"] = "G1X";
    TradestationOrderRoutingType["IEX"] = "IEX";
    TradestationOrderRoutingType["KCG"] = "KCG";
    TradestationOrderRoutingType["NQBX"] = "NQBX";
    TradestationOrderRoutingType["NSDQ"] = "NSDQ";
    TradestationOrderRoutingType["NYSE"] = "NYSE";
    TradestationOrderRoutingType["POV"] = "POV";
    TradestationOrderRoutingType["SSC"] = "SSC";
    TradestationOrderRoutingType["TWAP"] = "TWAP";
    TradestationOrderRoutingType["VWAP"] = "VWAP";
    TradestationOrderRoutingType["WEEP"] = "WEEP";
    TradestationOrderRoutingType["WEES"] = "WEES";
    TradestationOrderRoutingType["WEXP"] = "WEXP";
    TradestationOrderRoutingType["WEXS"] = "WEXS";
    TradestationOrderRoutingType["XNDQ"] = "XNDQ";
    TradestationOrderRoutingType["PHLX"] = "PHLX";
    TradestationOrderRoutingType["NYOP"] = "NYOP";
    TradestationOrderRoutingType["MCRY"] = "MCRY";
    TradestationOrderRoutingType["MIAX"] = "MIAX";
    TradestationOrderRoutingType["MPRL"] = "MPRL";
    TradestationOrderRoutingType["NOBO"] = "NOBO";
    TradestationOrderRoutingType["ISE"] = "ISE";
    TradestationOrderRoutingType["GMNI"] = "GMNI";
    TradestationOrderRoutingType["EMLD"] = "EMLD";
    TradestationOrderRoutingType["EDGO"] = "EDGO";
    TradestationOrderRoutingType["C2"] = "C2";
    TradestationOrderRoutingType["CBOE"] = "CBOE";
    TradestationOrderRoutingType["BOX"] = "BOX";
    TradestationOrderRoutingType["BAOP"] = "BAOP";
    TradestationOrderRoutingType["AMOP"] = "AMOP";
})(TradestationOrderRoutingType || (TradestationOrderRoutingType = {}));
//# sourceMappingURL=tradestation-order-routing.js.map