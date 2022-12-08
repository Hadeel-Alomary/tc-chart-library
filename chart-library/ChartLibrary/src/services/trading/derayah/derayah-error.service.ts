import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {DerayahHttpResponse} from '../../loader/trading/derayah-loader/derayah-loader.service';

@Injectable()
export class DerayahErrorService{

    private errorStream:Subject<DerayahError>;

    constructor(){
        this.errorStream = new Subject();
    }

    public getErrorStream():Subject<DerayahError>{
        return this.errorStream;
    }

    public extractErrorResponse(response:DerayahHttpResponse):DerayahError{
        return {
            expiredSession : response.responseCode == 2,
            message: response.message
        };
    }

    public onError(error:DerayahError){
        this.errorStream.next(error);
    }
}

export interface DerayahError{
    message:string;
    expiredSession:boolean;
}
