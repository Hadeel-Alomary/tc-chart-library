import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';


@Injectable()
export class VirtualTradingErrorService {

    private readonly errorStream: Subject<VirtualTradingError>;

    constructor(){
        this.errorStream = new Subject();
    }

    public getErrorStream():Subject<VirtualTradingError>{
        return this.errorStream;
    }


    public onError(error: VirtualTradingError){
        this.errorStream.next(error);
    }
}

export interface VirtualTradingError{
    message: string;
    success: boolean;
}
