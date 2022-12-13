import {Drawing, Indicator} from '../../stock-chart';


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
  type: ChannelRequestType
}

export interface ActionableChannelRequest extends ChannelRequest{
    requester?: ChannelRequester
}

export interface ShowDrawingSettingsDialogRequest extends ChannelRequest {
    drawing : Drawing;
}

export interface MessageBoxRequest extends ActionableChannelRequest {
  messageLine: string,
  messageLine2?:string,
}

export interface ShowIndicatorSettingsDialogRequest extends ChannelRequest {
    indicator : Indicator;
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

export interface DerayahLoginChannelRequest extends ChannelRequest{
  isReconnectMode: boolean;
}

export interface ConfirmationCaller {
  onConfirmation(confirmed:boolean, param:unknown):void;
}

export interface ConfirmationRequest extends ChannelRequest {
  caller: ConfirmationCaller,
  messageLine: string,
  messageLine2?:string,
  messageLine3?:string,
  param?: unknown
}

export interface TradestationConfirmCaller {
    onConfirmation(confirmed:boolean):void;
}

export interface TradestationCaller {
    onCancelConnection():void;
}

export interface ChannelRequester {
    onRequestComplete():void;
}
