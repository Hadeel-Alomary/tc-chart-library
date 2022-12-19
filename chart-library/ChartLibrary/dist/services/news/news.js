var News = (function () {
    function News() {
    }
    News.fromStreamer = function (message, market) {
        var id = message.ID;
        var date = message.DATE;
        var header = message.HEADER;
        var symbol = message.SYMBOL;
        var deleted = message.IS_DELETED == 'YES';
        return News.createNews(market, symbol, id, date, header, deleted);
    };
    News.fromLoader = function (announcement, market) {
        var id = announcement[0];
        var date = announcement[1];
        var header = announcement[2];
        var symbol = announcement[3];
        return News.createNews(market, symbol, id, date, header, false);
    };
    News.createNews = function (market, symbol, id, date, header, deleted) {
        var company;
        var isMarketNews = false;
        company = symbol ? market.getCompany(symbol) : null;
        if (!company) {
            isMarketNews = true;
            company = market.getGeneralIndex();
        }
        return {
            id: id,
            name: company.name,
            market: isMarketNews,
            symbol: company.symbol,
            date: date,
            header: header,
            url: 'https://www.tickerchart.com/tickerchart_live/AnnouncementDetails.php?announcementId=' + id,
            deleted: deleted,
            viewed: false
        };
    };
    News.getNewsFromIdAndTitle = function (id, title) {
        return {
            id: "".concat(id),
            name: null,
            market: null,
            symbol: null,
            date: null,
            header: title,
            url: "https://www.tickerchart.com/tickerchart_live/AnnouncementDetails.php?announcementId=".concat(id),
            deleted: false,
            viewed: false
        };
    };
    return News;
}());
export { News };
//# sourceMappingURL=news.js.map