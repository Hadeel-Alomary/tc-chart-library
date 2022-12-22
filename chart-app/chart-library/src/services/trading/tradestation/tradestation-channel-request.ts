import {ActionableChannelRequest, TradestationOrder} from "@src/services";

export interface TradestationBuySellChannelRequest extends ActionableChannelRequest {
  order: TradestationOrder;
  price?: number;
  stopPrice?:number;
  closeQuantity?:boolean;
}
