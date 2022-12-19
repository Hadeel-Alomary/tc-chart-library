import { Tc } from "../../utils/index";
var LoaderConfig = (function () {
    function LoaderConfig() {
    }
    LoaderConfig.url = function (config, type) {
        return config.urls[Tc.enumString(LoaderUrlType, type)];
    };
    LoaderConfig.marketAlertsConfig = function (config, type) {
        return config.urls[Tc.enumString(LoaderUrlType, type)];
    };
    return LoaderConfig;
}());
export { LoaderConfig };
export var LoaderUrlType;
(function (LoaderUrlType) {
    LoaderUrlType[LoaderUrlType["AlertsBase"] = 0] = "AlertsBase";
    LoaderUrlType[LoaderUrlType["AnnouncementSearch"] = 1] = "AnnouncementSearch";
    LoaderUrlType[LoaderUrlType["AnnouncementLatest"] = 2] = "AnnouncementLatest";
    LoaderUrlType[LoaderUrlType["AnnouncementCategory"] = 3] = "AnnouncementCategory";
    LoaderUrlType[LoaderUrlType["NewsTitle"] = 4] = "NewsTitle";
    LoaderUrlType[LoaderUrlType["Guid"] = 5] = "Guid";
    LoaderUrlType[LoaderUrlType["HostPort"] = 6] = "HostPort";
    LoaderUrlType[LoaderUrlType["AnalysisProfilesList"] = 7] = "AnalysisProfilesList";
    LoaderUrlType[LoaderUrlType["AnalysisSearch"] = 8] = "AnalysisSearch";
    LoaderUrlType[LoaderUrlType["DerayahIntegrationLink"] = 9] = "DerayahIntegrationLink";
    LoaderUrlType[LoaderUrlType["MarketsTickSize"] = 10] = "MarketsTickSize";
    LoaderUrlType[LoaderUrlType["VirtualTradingUrl"] = 11] = "VirtualTradingUrl";
    LoaderUrlType[LoaderUrlType["HistoricalLiquidity"] = 12] = "HistoricalLiquidity";
    LoaderUrlType[LoaderUrlType["AnalystsList"] = 13] = "AnalystsList";
    LoaderUrlType[LoaderUrlType["AnalysisByMarket"] = 14] = "AnalysisByMarket";
    LoaderUrlType[LoaderUrlType["AnalysisByCompany"] = 15] = "AnalysisByCompany";
    LoaderUrlType[LoaderUrlType["CommunityIdeas"] = 16] = "CommunityIdeas";
    LoaderUrlType[LoaderUrlType["CommunityNotifications"] = 17] = "CommunityNotifications";
    LoaderUrlType[LoaderUrlType["CommunityMyIdeas"] = 18] = "CommunityMyIdeas";
    LoaderUrlType[LoaderUrlType["MarkNotificationsAsRead"] = 19] = "MarkNotificationsAsRead";
    LoaderUrlType[LoaderUrlType["CommunityUserProfileUrl"] = 20] = "CommunityUserProfileUrl";
    LoaderUrlType[LoaderUrlType["CommunityHomePageUrl"] = 21] = "CommunityHomePageUrl";
    LoaderUrlType[LoaderUrlType["CommunityIdeaUrl"] = 22] = "CommunityIdeaUrl";
    LoaderUrlType[LoaderUrlType["CommunityCompanyUrl"] = 23] = "CommunityCompanyUrl";
    LoaderUrlType[LoaderUrlType["CommunityMarketUrl"] = 24] = "CommunityMarketUrl";
    LoaderUrlType[LoaderUrlType["CommunityPublishChart"] = 25] = "CommunityPublishChart";
    LoaderUrlType[LoaderUrlType["CommunityProfileInfo"] = 26] = "CommunityProfileInfo";
    LoaderUrlType[LoaderUrlType["CommunitySaveProfile"] = 27] = "CommunitySaveProfile";
    LoaderUrlType[LoaderUrlType["CommunityNickNameCheck"] = 28] = "CommunityNickNameCheck";
    LoaderUrlType[LoaderUrlType["CommunityCategoriesList"] = 29] = "CommunityCategoriesList";
    LoaderUrlType[LoaderUrlType["CommunityTagsSearch"] = 30] = "CommunityTagsSearch";
    LoaderUrlType[LoaderUrlType["RenewToken"] = 31] = "RenewToken";
    LoaderUrlType[LoaderUrlType["TcWebsiteUpgradeSubscription"] = 32] = "TcWebsiteUpgradeSubscription";
    LoaderUrlType[LoaderUrlType["TcWebsiteTokenGenerator"] = 33] = "TcWebsiteTokenGenerator";
    LoaderUrlType[LoaderUrlType["TcWebsiteRedirect"] = 34] = "TcWebsiteRedirect";
    LoaderUrlType[LoaderUrlType["TcWebsiteViewSubscribtions"] = 35] = "TcWebsiteViewSubscribtions";
    LoaderUrlType[LoaderUrlType["TcWebsiteSubscribe"] = 36] = "TcWebsiteSubscribe";
    LoaderUrlType[LoaderUrlType["TcWebsiteActivation"] = 37] = "TcWebsiteActivation";
    LoaderUrlType[LoaderUrlType["TcWebsiteReward"] = 38] = "TcWebsiteReward";
    LoaderUrlType[LoaderUrlType["Screenshots"] = 39] = "Screenshots";
    LoaderUrlType[LoaderUrlType["TechnicalScopeUrl"] = 40] = "TechnicalScopeUrl";
    LoaderUrlType[LoaderUrlType["Shareholders"] = 41] = "Shareholders";
    LoaderUrlType[LoaderUrlType["TradestationIntegrationLink"] = 42] = "TradestationIntegrationLink";
    LoaderUrlType[LoaderUrlType["TcWebsiteDerayahInfo"] = 43] = "TcWebsiteDerayahInfo";
    LoaderUrlType[LoaderUrlType["TcWebsiteSnbcapitalInfo"] = 44] = "TcWebsiteSnbcapitalInfo";
    LoaderUrlType[LoaderUrlType["TcWebsiteVirtualTradingInfo"] = 45] = "TcWebsiteVirtualTradingInfo";
    LoaderUrlType[LoaderUrlType["TcWebsiteTradestationInfo"] = 46] = "TcWebsiteTradestationInfo";
    LoaderUrlType[LoaderUrlType["DerayaAuthUrl"] = 47] = "DerayaAuthUrl";
    LoaderUrlType[LoaderUrlType["DerayahOauthBaseUrl"] = 48] = "DerayahOauthBaseUrl";
    LoaderUrlType[LoaderUrlType["DerayaTokenUrl"] = 49] = "DerayaTokenUrl";
    LoaderUrlType[LoaderUrlType["DerayahNotifications"] = 50] = "DerayahNotifications";
})(LoaderUrlType || (LoaderUrlType = {}));
//# sourceMappingURL=loader-config.js.map