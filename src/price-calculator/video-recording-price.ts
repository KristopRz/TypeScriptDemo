import { ServiceType, PriceConfigServices, PriceConfigDiscount } from "..";
import { PriceCalculator } from "./price-calculator";

export class VideoRecordingPrice extends PriceCalculator {
    protected getNameService(): ServiceType {
        return 'VideoRecording';
    }

    protected getAdditionalServicesToCountedWhenDiscountApplied(): ServiceType[] {
        return ['Photography'];
    }

    protected getBasicPriceConfig(): PriceConfigServices[] {
        return [
            { year: 2020, price: 1700 },
            { year: 2021, price: 1800 },
            { year: 2022, price: 1900 }
        ];
    }

    protected getDiscountsConfig(): PriceConfigDiscount[] {
        return [
            { subServices: ['Photography'], year: 2020, price: 2200 },
            { subServices: ['Photography'], year: 2021, price: 2300 },
            { subServices: ['Photography'], year: 2022, price: 2500 }
        ];
    }

}