import {ChannelRequest, DerayahOrder} from "@src/services";

export interface DerayahBuySellChannelRequest extends ChannelRequest {
  order: DerayahOrder;
  price?: number;
  onDone?: () => void;
}
