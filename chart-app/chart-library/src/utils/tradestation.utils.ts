export class TradestationUtils{

    static getSymbolWithMarketFromTradestation(TradestationSymbol:string):string{
        return `${TradestationSymbol}.USA`;
    }

    static getAllowedMarketsAbbreviations():string[]{
        return ["USA"];
    }

}
