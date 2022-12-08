
export class TradestationOrderRouting{

    private static allTypes:TradestationOrderRouting[];

    constructor(
        public value: string,
        public name:string,
    ){}

    public static getAllTypes():TradestationOrderRouting[]{
        if(!TradestationOrderRouting.allTypes) {
            TradestationOrderRouting.allTypes = [];
            TradestationOrderRouting.allTypes.push(new TradestationOrderRouting(TradestationOrderRoutingType.Intelligent, 'Intelligent',));
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
    }

    public static getOrderRoutingByType(value: string):TradestationOrderRouting{
        return TradestationOrderRouting.getAllTypes().find(item => item.value == value);
    }

}

export enum TradestationOrderRoutingType {
     Intelligent = 'Intelligent',
     AMEX = 'AMEX',
     ARCX = 'ARCX',
     BATS = 'BATS',
     BYX = 'BYX',
     CSFB = 'CSFB',
     EDGA = 'EDGA',
     G1X = 'G1X',
     IEX = 'IEX',
     KCG = 'KCG',
     NQBX = 'NQBX',
     NSDQ = 'NSDQ',
     NYSE = 'NYSE',
     POV = 'POV',
     SSC = 'SSC',
     TWAP = 'TWAP',
     VWAP = 'VWAP',
     WEEP = 'WEEP',
     WEES = 'WEES',
     WEXP = 'WEXP',
     WEXS = 'WEXS',
     XNDQ = 'XNDQ',
     PHLX = 'PHLX',
     NYOP = 'NYOP',
     MCRY = 'MCRY',
     MIAX = 'MIAX',
     MPRL = 'MPRL',
     NOBO = 'NOBO',
     ISE = 'ISE',
     GMNI = 'GMNI',
     EMLD = 'EMLD',
     EDGO = 'EDGO',
     C2 = 'C2',
     CBOE = 'CBOE',
     BOX = 'BOX',
     BAOP = 'BAOP',
     AMOP = 'AMOP'
}
