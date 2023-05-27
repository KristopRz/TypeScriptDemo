import { ServiceType, PriceConfigServices, PriceConfigDiscount } from "..";
import { PriceCalculator } from "./price-calculator";

export class WeddingSessionPrice extends PriceCalculator {
    protected getNameService(): ServiceType {
        return 'WeddingSession';
    }

    protected getBasicPriceConfig(): PriceConfigServices[] {
        return [
            { year: 2020, price: 600 },
            { year: 2021, price: 600 },
            { year: 2022, price: 600 }
        ];
    }

    protected getDiscountsConfig(): PriceConfigDiscount[] {
        return [
            { subServices: ['VideoRecording'], year: 2020, price: 300 },
            { subServices: ['VideoRecording'], year: 2021, price: 300 },
            { subServices: ['VideoRecording'], year: 2022, price: 300 },
            { subServices: ['Photography'], year: 2020, price: 300 },
            { subServices: ['Photography'], year: 2021, price: 300 },
            { subServices: ['Photography'], year: 2022, price: 0 }
        ];
    }
}