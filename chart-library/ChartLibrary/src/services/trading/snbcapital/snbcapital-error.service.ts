import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SnbcapitalPortfoliosResponse, SnbcapitalPositionResponse, SnbcapitalLoginResponse} from '../../loader/trading/snbcapital-loader';
import {SnbcapitalOrderResponse, SnbcapitalPreConfirmResponse, SnbcapitalPurchasePowerResponse, SnbcapitalQuantityCalculationResponse, SnbcapitalSuccessVerifyOtpResponse, SnbcapitalUpdatedOrderResponse, SnbcapitalUpdatePreConfirmOrderResponse, SnbcapitalWrongVerifyOtpResponse} from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import {LanguageService} from '../../state/language';

@Injectable()
export class SnbcapitalErrorService{

    private errorStream:Subject<SnbcapitalError>;

    constructor(private languageService: LanguageService){
        this.errorStream = new Subject();
    }

    public getErrorStream():Subject<SnbcapitalError>{
        return this.errorStream;
    }

    public extractErrorResponse(response:SnbcapitalErrorHttpResponse):SnbcapitalError{
        let isSessionExpired: boolean = response.__errorData__.type == 'SESSIONEXPIRED';
        if(isSessionExpired){
            return this.getSessionExpiredError();
        }

        return {
            expiredSession: false,
            message: response.__errorData__.message,
        };
    }

    public emitSessionExpiredError() {
         this.onError(this.getSessionExpiredError())
    }

    public getSessionExpiredError(){
        return {
            expiredSession: true,
            message: this.languageService.translate('إنتهت الجلسة يرجى إعادة الربط مرة أخرى.'),
        };
    }

    public onError(error:SnbcapitalError){
        this.errorStream.next(error);
    }

    public errorDataResponseValidation <T>(response: T | SnbcapitalErrorHttpResponse): SnbcapitalError {
        if(response['__errorData__']){
            return this.extractErrorResponse(response as SnbcapitalErrorHttpResponse);
        }
        return null;
    }

}

export interface SnbcapitalError{
    message:string;
    expiredSession:boolean;
}

export interface SnbcapitalErrorHttpResponse {
    __errorData__: SnbcapitalErrorDataResponse,
    otpResendTimeout: string,
    __errorCode__: number,
    EnablePasswordEncryption: string,
    pk_exp: string,
    pk_mod: string
}

export interface SnbcapitalErrorDataResponse {
    message: string,
    nameXsl: string,
    context: string,
    params: Object[],
    type: string,
    errorCodes: string[]
}


