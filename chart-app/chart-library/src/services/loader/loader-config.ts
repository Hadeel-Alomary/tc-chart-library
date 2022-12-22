import {Tc} from "../../utils/index";
import {MarketAlertsConfig} from "../../data-types/types";


export class LoaderConfig {

    marketAlerts: MarketAlertsConfig;
    guidInterval: number;
    guidKey:string;
    urls:{[key:string]:string};

    static url(config:LoaderConfig, type:LoaderUrlType):string {
        return config.urls[Tc.enumString(LoaderUrlType, type)];
    }

    static marketAlertsConfig(config:LoaderConfig, type:LoaderUrlType):string {
        return config.urls[Tc.enumString(LoaderUrlType, type)];
    }

}

export enum LoaderUrlType {
    AlertsBase,
    AnnouncementSearch,
    AnnouncementLatest,
    AnnouncementCategory,
    NewsTitle,
    Guid,
    HostPort,
    AnalysisProfilesList,
    AnalysisSearch,
    DerayahIntegrationLink,
    MarketsTickSize,
    VirtualTradingUrl,
    HistoricalLiquidity,
    AnalystsList,
    AnalysisByMarket,
    AnalysisByCompany,
    CommunityIdeas,
    CommunityNotifications,
    CommunityMyIdeas,
    MarkNotificationsAsRead,
    CommunityUserProfileUrl,
    CommunityHomePageUrl,
    CommunityIdeaUrl,
    CommunityCompanyUrl,
    CommunityMarketUrl,
    CommunityPublishChart,
    CommunityProfileInfo,
    CommunitySaveProfile,
    CommunityNickNameCheck,
    CommunityCategoriesList,
    CommunityTagsSearch,
    RenewToken,
    TcWebsiteUpgradeSubscription,
    TcWebsiteTokenGenerator,
    TcWebsiteRedirect,
    TcWebsiteViewSubscribtions,
    TcWebsiteSubscribe,
    TcWebsiteActivation,
    TcWebsiteReward,
    Screenshots,
    TechnicalScopeUrl,
    Shareholders,
    TradestationIntegrationLink,
    TcWebsiteDerayahInfo,
    TcWebsiteSnbcapitalInfo,
    TcWebsiteVirtualTradingInfo,
    TcWebsiteTradestationInfo,
    DerayaAuthUrl,
    DerayahOauthBaseUrl,
    DerayaTokenUrl,
    DerayahNotifications

}

