import { Indicator } from "./Indicator";
import { ITAIndicatorConfig } from "./TAIndicator";
export declare class IndicatorDeserializer {
    private static _instance;
    static get instance(): IndicatorDeserializer;
    private constructor();
    deserialize(state: ITAIndicatorConfig): Indicator;
}
//# sourceMappingURL=IndicatorDeserializer.d.ts.map