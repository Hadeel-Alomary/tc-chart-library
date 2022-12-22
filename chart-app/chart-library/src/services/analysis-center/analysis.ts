import {Company} from '../loader';
import {CommunityAuthorType, MarketGridData} from "../../data-types/types";

export class Analyzer{

    constructor(
        public name:string,
        public nickName:string
    ){}

    private static allAnalyzers:Analyzer = new Analyzer(
        'جميع المحللين',
        'all',
    );

    static AllAnalyzers():Analyzer{
        return Analyzer.allAnalyzers;
    }
}

export interface Analysis extends  MarketGridData{
    title:string;
    description:string;
    created:string;
    url:string;
    thumbnailUrl:string;
    videoUrl:string;
    nickName:string;
    profileName:string;
    authorType:CommunityAuthorType;
    avatarUrl:string;
    views:number;
    likes:number;
    comments:number;
    followers:number;
    deleted: boolean;
    viewed: boolean;
    company:Company;
    intervalName: string;
}
