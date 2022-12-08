import {Injectable} from '@angular/core';
import {ICallbackFunction, ViewLoader, ViewLoaderType} from './view-loader';
import {LanguageService} from "../../state/index";


@Injectable()
export class ViewLoadersService{

    private loaders:{[type:number]:ViewLoader} = {};

    constructor(public languageService:LanguageService){}

    public register(loader:ViewLoader):void{
        this.loaders[loader.type] = loader;
    }

    public load(type:ViewLoaderType, onLoad: ICallbackFunction):void{
        this.loaders[type].load(onLoad, this.languageService);
    }
}
