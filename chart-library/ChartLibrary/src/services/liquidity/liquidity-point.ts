import {LiquidityMessage} from '../streaming/shared';

export class LiquidityPoint {
    constructor(
        public time: string,
        public inflowAmount: number,
        public inflowVolume: number,
        public outflowAmount: number,
        public outflowVolume: number,
        public percentage: number,
        public netVolume: number,
        public netAmount: number
    ) {}

    public static fromLoaderData(data: string[]): LiquidityPoint[] {
        let results: LiquidityPoint[] = [];
        let fieldsList = data[0];

        let timeIndex: number;
        let inflowAmountIndex: number;
        let inflowVolumeIndex: number;
        let outflowAmountIndex: number;
        let outflowVolumeIndex: number;
        let percentageIndex: number;
        let netVolumeIndex: number;
        let netAmountIndex: number;

        for(let i = 0, n = fieldsList.length; i < n; i++) {
            let fieldName = fieldsList[i];
            switch (fieldName) {
                case 'time': timeIndex = i; break;
                case 'inf-amnt': inflowAmountIndex = i; break;
                case 'inf-vol': inflowVolumeIndex = i; break;
                case 'outf-amnt': outflowAmountIndex = i; break;
                case 'outf-vol': outflowVolumeIndex = i; break;
                case 'prcnt': percentageIndex = i; break;
                case 'net-vol': netVolumeIndex = i; break;
                case 'net-amnt': netAmountIndex = i; break;
            }
        }

        for(let i = 1, n = data.length; i < n; i++) {
            let liquidityEntry = data[i];

            results.push(new LiquidityPoint(
                liquidityEntry[timeIndex],
                +liquidityEntry[inflowAmountIndex],
                +liquidityEntry[inflowVolumeIndex],
                +liquidityEntry[outflowAmountIndex],
                +liquidityEntry[outflowVolumeIndex],
                +liquidityEntry[percentageIndex],
                +liquidityEntry[netVolumeIndex],
                +liquidityEntry[netAmountIndex]
            ));
        }

        return results;
    }

    public static fromLiquidityMessage(message: LiquidityMessage): LiquidityPoint {
        return new LiquidityPoint(
            message.time,
            +message.inflowAmount,
            +message.inflowVolume,
            +message.outflowAmount,
            +message.outflowVolume,
            +message.percent,
            +message.netVolume,
            +message.netAmount
        );
    }
}
