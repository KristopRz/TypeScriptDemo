import { PriceConfigDiscount, PriceConfigServices, ServiceType } from "..";
import { PriceCalculator } from "./price-calculator";

export class PhotographyPrice extends PriceCalculator {
    protected getNameService(): ServiceType {
        return 'Photography';
    }

    protected getAdditionalServicesToCountedWhenDiscountApplied(): ServiceType[] {
        return ['VideoRecording'];
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
            { subServices: ['VideoRecording'], year: 2020, price: 2200 },
            { subServices: ['VideoRecording'], year: 2021, price: 2300 },
            { subServices: ['VideoRecording'], year: 2022, price: 2500 }
        ];
    }
}