import {ActionableChannelRequest, SnbcapitalOrder} from "@src/services";

export interface SnbcapitalBuySellChannelRequest extends ActionableChannelRequest {
  order: SnbcapitalOrder;
  price?: number;
  onDone?: () => void;
}
