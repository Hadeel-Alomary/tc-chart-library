import {GridBoxType} from '../../components/shared/index';
import {Chart, Drawing, Indicator} from '../../stock-chart';
import {ChartElementsContainerTabType} from '../../components/modals/chart/chart-elements-container/chart-elements-container-tab-type';
import {ChartElementsContainer} from '../../components/chart/chart-elements-container';
import {PublishedIdea} from '../publisher/published-chart';
import {ChartTheme} from '../../stock-chart/StockChartX/Theme';
import {ChartSettingsContainer} from '../../components/chart/chart-settings-container';
import {AddIntervalCaller} from '../../components/modals/add-interval/add-interval.component';


export enum ChannelRequestType {
    WatchlistProperties = 1,
    NewWatchlist,
    Confirmation,
    MessageBox,
    OptionalMessageBox,
    PageTitle,
    Alert,
    AlertCenter,
    GridColumnProperties,
    News,
    Analysis,
    Selection,
    SettingsMenu,
    ContactUs,
    OpenSymbol,
    OpenMarket,
    MyDrawing,
    ShowContextMenu,
    ToggleMaximizeWindow,
    Reload,
    FilterProperties,
    NewFilter,
    MarketAlertsProperties,
    ForceLogout,
    Logout,
    FilterRefresh,
    WatchlistRefresh,
    DerayahConnect,
    DerayahBuy,
    DerayahSell,
    DerayahOrderDetails,
    DerayahQuantityCalculator,
    SnbcapitalConnect,
    SnbcapitalBuySell,
    SnbcapitalOrderDetails,
    SnbcapitalQuantityCalculator,
    SnbcapitalSettings,
    TradingFloatingToolbar,
    VirtualTradingConnect,
    VirtualTradingBuySell,
    VirtualTradingOrderDetails,
    VirtualTradingManualPortfolioControl,
    VirtualTradingSettings,
    VirtualTradingAccount,
    VirtualTradingTransactions,
    BrokerSelection,
    DrawingSettingsDialog,
    DrawingToolbar,
    IndicatorSettingsDialog,
    IchimokuCloudSettingsDialog,
    UpgradeMessage,
    SignIn,
    SignUp,
    SignInOrSignUp,
    ForgetPassword,
    InactiveTab,
    SwitchLanguageConfirmation,
    IndicatorSelection,
    FiboDrawingSettingsDialog,
    SelectChartDrawing,
    ChartScreenshot,
    ChartSignatureDialog,
    AddSignatureDialog,
    ObjectTreeDialog,
    PublishIdea,
    PublisherProfile,
    chartSettingsDialog,
    SwitchTheme,
    WorkspaceSelect,
    WorkspaceRefresh,
    WorkspaceUpdateInProgress,
    CommunityWindows,
    SupportInfo,
    UserDefinedWatchListUpdated,
    ForceScreenReload,
    TechnicalScopeProperties,
    AddInterval,
    UnsupportedAlertMessage,
    TradestationConnect,
    TradestationBuySell,
    TradestationMessage,
    TradestationConfirmationMessage,
    TradestationAccountTransactions,
    TradestationOrderDetails,
    TradestationSettings
}

export interface ChannelRequest {
    type:ChannelRequestType
}

interface OpenRequest extends ChannelRequest {
    gridBoxType:GridBoxType;
    param?: string|boolean
}

export interface SymbolBoxOpenRequest extends OpenRequest{
    symbol:string
}

export interface MarketBoxOpenRequest extends OpenRequest{
    watchlistId:string
}

export interface ActionableChannelRequest extends ChannelRequest{
    requester?: ChannelRequester
}

export interface ShowDrawingSettingsDialogRequest extends ChannelRequest {
    drawing : Drawing;
}

export interface ShowIndicatorSettingsDialogRequest extends ChannelRequest {
    indicator : Indicator;
}

export interface ShowDrawingToolbarRequest extends ChannelRequest {
    drawing : Drawing;
    visible :boolean;
}

export interface ChartScreenshotRequest extends ChannelRequest {
    chart: Chart;
    backgroundScreenshot?:boolean;
    backgroundScreenshotCb?: (imageBas64Data:string) => void
}


export interface ChartSignatureRequest extends ChannelRequest {
    chart: Chart;
}

export interface ShowPublishIdeaModalRequest extends ChannelRequest {
    publishedIdea: PublishedIdea;
}


export interface ShowObjectTreeDialogRequest extends ChannelRequest {
    activeTab: ChartElementsContainerTabType,
    container: ChartElementsContainer
}

export interface ShowChartSettingsDialogRequest extends ChannelRequest {
    container: ChartSettingsContainer;
}

export interface ForceScreenReloadRequest extends ChannelRequest {
    market: string;
}

export interface TradestationChannelRequest extends ChannelRequest {
    caller: TradestationCaller,
}

export interface TradestationMessageChannelRequest extends ChannelRequest {
    messageLines: string[],
    isErrorMessage: boolean,
    showWarningMessage: boolean
}

export interface TradestationConfirmationMessageChannelRequest extends ChannelRequest {
    caller: TradestationConfirmCaller,
    messageLines: string[],
    warningMessageLines? :string[]
}

export interface TradestationConfirmCaller {
    onConfirmation(confirmed:boolean):void;
}

export interface TradestationCaller {
    onCancelConnection():void;
}

export interface AddIntervalRequest extends ChannelRequest {
    caller: AddIntervalCaller
}


export interface ChannelRequester {
    onRequestComplete():void;
}
