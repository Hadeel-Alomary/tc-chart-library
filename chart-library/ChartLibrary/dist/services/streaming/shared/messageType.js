export var MessageType;
(function (MessageType) {
    MessageType[MessageType["QUOTE"] = 1] = "QUOTE";
    MessageType[MessageType["HEARTBEAT"] = 2] = "HEARTBEAT";
    MessageType[MessageType["TIME_AND_SALE"] = 3] = "TIME_AND_SALE";
    MessageType[MessageType["MARKET_SUMMARY"] = 4] = "MARKET_SUMMARY";
    MessageType[MessageType["MARKET_DEPTH_BY_ORDER"] = 5] = "MARKET_DEPTH_BY_ORDER";
    MessageType[MessageType["MARKET_DEPTH_BY_ORDER_10"] = 6] = "MARKET_DEPTH_BY_ORDER_10";
    MessageType[MessageType["MARKET_DEPTH_BY_PRICE"] = 7] = "MARKET_DEPTH_BY_PRICE";
    MessageType[MessageType["MARKET_DEPTH_BY_PRICE_10"] = 8] = "MARKET_DEPTH_BY_PRICE_10";
    MessageType[MessageType["MARKET_ALERT"] = 9] = "MARKET_ALERT";
    MessageType[MessageType["BIG_TRADE"] = 10] = "BIG_TRADE";
    MessageType[MessageType["ALERTS"] = 11] = "ALERTS";
    MessageType[MessageType["NEWS"] = 12] = "NEWS";
    MessageType[MessageType["ANALYSIS"] = 13] = "ANALYSIS";
    MessageType[MessageType["VIRTUAL_TRADING"] = 14] = "VIRTUAL_TRADING";
    MessageType[MessageType["LIQUIDITY"] = 15] = "LIQUIDITY";
    MessageType[MessageType["COMMUNITY_NOTIFICATIONS"] = 16] = "COMMUNITY_NOTIFICATIONS";
    MessageType[MessageType["CHART_INTRADAY"] = 17] = "CHART_INTRADAY";
    MessageType[MessageType["CHART_DAILY"] = 18] = "CHART_DAILY";
    MessageType[MessageType["TECHNICAL_SCOPE"] = 19] = "TECHNICAL_SCOPE";
    MessageType[MessageType["TECHNICAL_SCOPE_QUOTE"] = 20] = "TECHNICAL_SCOPE_QUOTE";
    MessageType[MessageType["TECHNICAL_INDICATOR"] = 21] = "TECHNICAL_INDICATOR";
})(MessageType || (MessageType = {}));
//# sourceMappingURL=messageType.js.map