var CategoryNews = (function () {
    function CategoryNews(id, date, companyId) {
        this.id = id;
        this.date = date;
        this.companyId = companyId;
    }
    CategoryNews.fromLoaderData = function (newsList) {
        var result = [];
        for (var _i = 0, newsList_1 = newsList; _i < newsList_1.length; _i++) {
            var news = newsList_1[_i];
            result.push(new CategoryNews(+news.news_id, news.daily_date, +news.company_id));
        }
        return result;
    };
    return CategoryNews;
}());
export { CategoryNews };
//# sourceMappingURL=category-news.js.map