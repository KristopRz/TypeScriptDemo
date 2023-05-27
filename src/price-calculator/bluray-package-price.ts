import { ServiceType, PriceConfigServices } from "..";
import { PriceCalculator } from "./price-calculator";

export class BlurayPackagePrice extends PriceCalculator {
    protected getNameService(): ServiceType {
        return 'BlurayPackage';
    }

    protected getBasicPriceConfig(): PriceConfigServices[] {
        return [
            { year: 2020, price: 300 },
            { year: 2021, price: 300 },
            { year: 2022, price: 300 }
        ];
    }
}