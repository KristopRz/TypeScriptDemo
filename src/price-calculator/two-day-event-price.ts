import { ServiceType, PriceConfigServices } from "..";
import { PriceCalculator } from "./price-calculator";

export class TwoDayEventPrice extends PriceCalculator {
    protected getNameService(): ServiceType {
        return 'TwoDayEvent';
    }

    protected getBasicPriceConfig(): PriceConfigServices[] {
        return [
            { year: 2020, price: 400 },
            { year: 2021, price: 400 },
            { year: 2022, price: 400 }
        ];
    }
}