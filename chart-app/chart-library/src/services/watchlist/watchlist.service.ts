import {Injectable} from '@angular/core';
import {Watchlist, WatchlistType} from './watchlist';
import {StringUtils, Tc, TcTracker} from '../../utils/index';
import {Market} from '../loader/market';
import {LanguageService,} from '../language/index';
import {ArrayUtils} from '../../utils/array.utils';
import {ChannelRequestType, MessageBoxRequest} from "../../services/shared-channel/channel-request";
import {SharedChannel, WatchlistLoader} from "../../services";

const remove = require("lodash/remove");
const isEqual = require("lodash/isEqual");

@Injectable()
export class WatchlistService {

    private userDefinedWatchlists:Watchlist[] = [];
    private marketBuiltinWatchlist:{[marketAbbreviation:string]:Watchlist[]} = {};
    private tradingWatchlists:Watchlist[] = [];

    constructor(
                private languageService:LanguageService,
                private watchlistLoader:WatchlistLoader,
                private sharedChannel:SharedChannel,
                ) {

        // this.loader.isLoadingDoneStream().subscribe(loadingDone => {
        //     if (loadingDone) {
        //         this.initWatchlists();
        //         if(!this.authorizationService.isVisitor()) {
        //             this.syncCloudWatchlists();
        //         }
        //         this.loader.getMarketStream().subscribe(market => this.onMarket(market), error => Tc.error(error));
        //     }
        // });
    }

    private syncCloudWatchlists() {
        // let markets = this.marketsManager.getAllSubscribedMarkets();
        // this.watchlistLoader.loadWatchlists().subscribe(serverWatchlists => {
        //     if(this.syncCloudWatchlistsWithUserDefinedOnes(serverWatchlists.deleted, serverWatchlists.active)) {
        //         TcTracker.trackRefreshSyncCloudWatchlist();
        //         this.sharedChannel.request({type: ChannelRequestType.WatchlistRefresh});
        //     }
        // })
    }

    private initWatchlists() {
        // if (this.stateService.has(StateKey.Watchlist)) {
        //     let watchlists: Watchlist[] = this.stateService.get(StateKey.Watchlist) as Watchlist[];
        //     for (let watchlist of watchlists) {
        //         if (watchlist.type == WatchlistType.UserDefined) {
        //             this.userDefinedWatchlists.push(watchlist);
        //         } else if (watchlist.type == WatchlistType.Trading) {
        //             this.tradingWatchlists.push(watchlist);
        //         }
        //     }
        // }
    }

    create(name:string) {
        TcTracker.trackCreateWatchlist();
        let watchlist:Watchlist = {type:WatchlistType.UserDefined, id:StringUtils.guid(), name:name, symbols: {}};
        this.userDefinedWatchlists.push(watchlist);
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
        return watchlist;
    }

    get(id:string):Watchlist {
        let watchlist:Watchlist = this.getUserDefined(id);
        if(watchlist == null){
            watchlist = this.getTradingWatchlist(id);
        }
        if(watchlist == null) {
            watchlist = this.getBuiltin(id);
        }
        return watchlist;
    }

    getUserDefined(id:string):Watchlist {
        return this.userDefinedWatchlists.find(watchlist => watchlist.id == id);
    }

    getBuiltin(id:string):Watchlist {
        for(let marketWatchlists of ArrayUtils.values(this.marketBuiltinWatchlist)){
            let result = marketWatchlists.find(watchlist => watchlist.id == id);
            if(result){
                return result;
            }
        }
        return null;
    }

    isBuiltin(id:string):boolean {
        return this.getBuiltin(id) != null;
    }

    remove(watchlist:Watchlist) {
        TcTracker.trackDeleteWatchlist();
        remove(this.userDefinedWatchlists, (w: Watchlist) => w === watchlist);
        this.watchlistLoader.deleteWatchlist(watchlist);
        this.save();
    }

    isDeleted(id:string):boolean {
        return this.get(id) == null;
    }

    save() {
        let storedWatchlists = this.userDefinedWatchlists.concat(this.tradingWatchlists);
        // this.stateService.set(StateKey.Watchlist, storedWatchlists);
    }

    getBuiltinWatchlists(marketAbbreviation:string):Watchlist[] {
        return this.marketBuiltinWatchlist[marketAbbreviation];
    }

    getAllMarketWatchlist(marketAbbreviation:string):Watchlist {
        return this.getBuiltinWatchlists(marketAbbreviation).find(watchlist => watchlist.type == WatchlistType.All);
    }

    getUserDefinedWatchlists():Watchlist[] {
        return this.userDefinedWatchlists;
    }

    filter(watchlist:Watchlist, symbol:string):boolean {
        //
        // let company = this.marketsManager.getCompanyBySymbol(symbol);
        //
        // if(watchlist.type == WatchlistType.UserDefined || watchlist.type == WatchlistType.Trading) {
        //     return company.symbol in watchlist.symbols;
        // }
        //
        // let symbolMarketAbbr = this.marketsManager.getMarketBySymbol(symbol).abbreviation;
        // let watchlistMarketAbbr:string = this.getMarketAbbrForBuiltinWatchlist(watchlist);
        //
        // if(symbolMarketAbbr != watchlistMarketAbbr) {
        //     return false; // MA symbol doesn't belong to built-in watchlist market, so ignore
        // }
        //
        // if(watchlist.type == WatchlistType.All) {
        //     if(watchlistMarketAbbr === "USA") {
        //         return company.tags.includes(CompanyTag.USA_DOWJONES);
        //     }
        //     return true;
        // }
        //
        // if(watchlist.type == WatchlistType.Indices) {
        //     return company.index;
        // }
        //
        // if(watchlist.type == WatchlistType.Sector) {
        //     return company.categoryId == watchlist.sectorId;
        // }

        return false;
    }

    public getWatchListSymbols(watchList: Watchlist): string[] {

        if(watchList.type == WatchlistType.UserDefined || watchList.type == WatchlistType.Trading) {
            return Object.keys(watchList.symbols);
        }

        // let marketAbbr = this.getMarketAbbrForBuiltinWatchlist(watchList),
        //     market = this.marketsManager.getMarketByAbbreviation(marketAbbr),
        //     symbols: string[] = [];
        //
        // if (watchList.type == WatchlistType.All) {
        //     market.companies.forEach(company => {
        //         if(market.abbreviation !== 'USA' || company.tags.includes(CompanyTag.USA_DOWJONES)) {
        //             symbols.push(company.symbol);
        //         }
        //     });
        // }
        //
        // if (watchList.type == WatchlistType.Sector) {
        //     market.companies.forEach(company => {
        //         if (company.categoryId == watchList.sectorId) {
        //             symbols.push(company.symbol);
        //         }
        //     });
        // }
        //
        // if (watchList.type == WatchlistType.Indices) {
        //     market.companies.forEach(company => {
        //         if (company.index) {
        //             symbols.push(company.symbol);
        //         }
        //     });
        // }

        // return symbols;
      return null;
    }

    updateWatchlistName(watchlist: Watchlist, name: string) {
        watchlist.name = name;
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
    }

    addSymbolToWatchlist(watchlist:Watchlist, symbol:string){
        this.addSymbolsToWatchlist(watchlist, [symbol]);
    }

    private showExceedMessage(): void {
        let message: string = this.languageService.translate('لا يمكن إضافة جميع الشركات المختارة إلى لائحة الأسهم .');
        let message2:string = this.languageService.translate('عدد الشركات في لائحة الأسهم سيتجاوز الحد المسموح به وهو (700) شركة , الرجاء حذف بعض الشركات من اللائحة لتتمكن من إضافة شركات اخرى .');
        let request: MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message,messageLine2: message2};
        this.sharedChannel.request(request);
    }

    addSymbolsToWatchlist(watchlist:Watchlist, symbols:string[]){
        if (Object.keys(watchlist.symbols).length + symbols.length > 700) {
            this.showExceedMessage();
        } else {
            Tc.assert(watchlist.type == WatchlistType.UserDefined, "can only add symbol to user defined watchlist");
            symbols.forEach(symbol => watchlist.symbols[symbol] = symbol);
            this.save();
            this.watchlistLoader.saveWatchlist(watchlist);
            this.sharedChannel.request(({type: ChannelRequestType.UserDefinedWatchListUpdated}));
        }
    }

    removeSymbolFromWatchlist(watchlist:Watchlist, symbol:string){
        this.removeSymbolsFromWatchlist(watchlist, [symbol]);
    }

    removeSymbolsFromWatchlist(watchlist:Watchlist, symbols:string[]){
        Tc.assert(watchlist.type == WatchlistType.UserDefined, "can only add symbol to user defined watchlist");
        symbols.forEach(symbol => delete watchlist.symbols[symbol]);
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
        this.sharedChannel.request(({type: ChannelRequestType.UserDefinedWatchListUpdated}));
    }

    doBelongToSameMarket(watchlist1:Watchlist, watchlist2:Watchlist):boolean {

        // if(!this.marketsManager.subscribedInMultipleMarkets()) {
        //     return true;
        // }

        if(watchlist1.type == WatchlistType.UserDefined || watchlist2.type == WatchlistType.UserDefined) {
            return false;
        }

        if(watchlist1.type == WatchlistType.Trading || watchlist2.type == WatchlistType.Trading) {
            return false;
        }

        let marketAbbr1:string = this.getMarketAbbrForBuiltinWatchlist(watchlist1);
        let marketAbbr2:string = this.getMarketAbbrForBuiltinWatchlist(watchlist2);

        return marketAbbr1 == marketAbbr2;

    }

    getMarketsForWatchlist(watchlist:Watchlist):Market[] {

        let markets:Market[] = [];

        if(watchlist.type == WatchlistType.UserDefined || watchlist.type == WatchlistType.Trading) {
            Object.keys(watchlist.symbols).forEach(symbol => {
               // let market:Market = this.marketsManager.getMarketBySymbol(symbol);
               // if(!markets.includes(market)) {
               //     markets.push(market);
               // }
            });
        } else {
            // markets.push(this.marketsManager.getMarketByAbbreviation(this.getMarketAbbrForBuiltinWatchlist(watchlist)));
        }

        return markets;
    }

    /* trading watchlists */

    public getTradingWatchlists():Watchlist[]{
        return this.tradingWatchlists;
    }
    public addTradingWatchlist(watchlist: Watchlist): void {
        this.tradingWatchlists.push(watchlist);
        this.save();
    }

    public removeTradingWatchlist(watchlist:Watchlist):void {
        remove(this.tradingWatchlists, (w: Watchlist) => w === watchlist);
        this.save();
    }

    public removeAllTradingWatchlists(): void {
        this.tradingWatchlists = [];
        this.save();
    }

    private getTradingWatchlist(id:string):Watchlist{
        return this.tradingWatchlists.find(watchlist => watchlist.id == id);
    }

    private getMarketAbbrForBuiltinWatchlist(watchlist:Watchlist):string{
        Tc.assert(watchlist.type != WatchlistType.UserDefined, "not built-in watchlist");
        for(let marketAbbr of Object.keys(this.marketBuiltinWatchlist)) {
            if(this.marketBuiltinWatchlist[marketAbbr].includes(watchlist)) {
                return marketAbbr;
            }
        }
        Tc.error("fail to find market for given built-in watchlist");
        return null;
    }



    private onMarket(market:Market) {
        this.initMarketBuiltinWatchlists(market);
    }

    private initMarketBuiltinWatchlists(market:Market) {

        // MA IMPORTANT! "ids" for built-in watchlists should be static and not changing dynamically, and therefore,
        // they depende on symbols. This is needed since screen properties save "id" for watchlist.
        if(market.abbreviation == 'USA') {
            this.marketBuiltinWatchlist[market.abbreviation] = [{type: WatchlistType.All, id: market.abbreviation, name: market.name}];
        }else {
            let allMarketWatchlist = {type: WatchlistType.All, id: market.abbreviation, name: this.getMarketBuiltinWatchlistsName(WatchlistType.All, market)};
            let builtinWatchlists:Watchlist[] = [allMarketWatchlist];
            builtinWatchlists.push({type: WatchlistType.Indices, id: market.abbreviation + '.IDX', name: this.getMarketBuiltinWatchlistsName(WatchlistType.Indices, market)});
            market.companies.forEach(company => {
                if(company.index && !company.generalIndex) { // NK we should ignore the general index
                    builtinWatchlists.push({type: WatchlistType.Sector, id:company.symbol, name: company.name, sectorId:company.categoryId});
                }
            });
            this.marketBuiltinWatchlist[market.abbreviation] = builtinWatchlists;

        }
    }

    private getMarketBuiltinWatchlistsName(type:WatchlistType, market:Market){
        //NK this method is only for all and indices watchlists because the sector watchlist depends on company name not market
        let name = '';
        if(type == WatchlistType.All){
            name = this.languageService.translate('جميع الأسهم');
        }else if(type == WatchlistType.Indices){
            name = this.languageService.translate('جميع المؤشرات');
        }

        // if(this.marketsManager.subscribedInMultipleMarkets()){
        //     name += ' - ' + market.name;
        // }

        return name;
    }

    private syncCloudWatchlistsWithUserDefinedOnes(deletedServerWatchlists:string[], activeServerWatchlists: Watchlist[]):boolean {

        let syncChanged:boolean = false;

        // 1) delete any local watchlists that is deleted on server
        deletedServerWatchlists.forEach(serverWatchlistId => {
            let userDefinedWatchlist = this.getUserDefined(serverWatchlistId);
            if (userDefinedWatchlist) {
                remove(this.userDefinedWatchlists, (w: Watchlist) => w === userDefinedWatchlist);
                TcTracker.trackDeleteSyncCloudWatchlist();
                syncChanged = true;
            }
        })

        // 2) sync server watchlists with local ones
        activeServerWatchlists.forEach(serverWatchlist => {
            let userDefinedWatchlist = this.getUserDefined(serverWatchlist.id);
            if (!userDefinedWatchlist) {
                this.userDefinedWatchlists.push({
                    type: WatchlistType.UserDefined,
                    id: serverWatchlist.id,
                    name: serverWatchlist.name,
                    symbols: serverWatchlist.symbols
                });
                TcTracker.trackCreateSyncCloudWatchlist();
                syncChanged = true;
            } else {
                let needsUpdate =
                    (userDefinedWatchlist.name != serverWatchlist.name) ||
                    !isEqual(userDefinedWatchlist.symbols, serverWatchlist.symbols);
                if(needsUpdate){
                    userDefinedWatchlist.name = serverWatchlist.name;
                    userDefinedWatchlist.symbols = serverWatchlist.symbols;
                    TcTracker.trackUpdateSyncCloudWatchlist();
                    syncChanged = true;
                }
            }
        })

        // 3) delete local watchlists (non-sycned) that do not exist on the cloud
        this.getUserDefinedWatchlists().slice(0).forEach(userDefinedWatchlist => {
            if(!activeServerWatchlists.find(w => w.id == userDefinedWatchlist.id)) {
                remove(this.userDefinedWatchlists, (w: Watchlist) => w === userDefinedWatchlist);
                TcTracker.trackDeleteNonSyncedCloudWatchlist();
                syncChanged = true;
            }
        });

        if(syncChanged) {
            this.save();
        }

        return syncChanged;

    }
}

