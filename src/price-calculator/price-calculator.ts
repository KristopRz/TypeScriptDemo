import { ServiceYear, ServiceType, PriceConfigServices, PriceConfigDiscount } from '../index';

export type PriceResult = {
    basePrice: number;
    finalPrice: number;
    countedServices: ServiceType[];
};

export abstract class PriceCalculator {
    protected abstract getNameService(): ServiceType;
    protected abstract getBasicPriceConfig(): PriceConfigServices[];

    protected getDiscountsConfig(): PriceConfigDiscount[] {
        return [];
    }

    protected getAdditionalServicesToCountedWhenDiscount(): ServiceType[] {
        return [];
    }

    private getBasicPrice(selectedYear: ServiceYear): number {
        const basicPriceConfig: PriceConfigServices[] = this.getBasicPriceConfig();
        const selectedPriceConfig: PriceConfigServices | undefined = basicPriceConfig.find((x: PriceConfigServices) => x.year === selectedYear);
        return selectedPriceConfig ? selectedPriceConfig.price : 0;
    }

    private getDiscounts(selectedYear: ServiceYear, selectedServices: ServiceType[]): PriceConfigDiscount[] {
        const discountsConfig: PriceConfigDiscount[] = this.getDiscountsConfig();
        return discountsConfig.filter((x: PriceConfigDiscount) => x.year === selectedYear &&
            x.subServices.every((subService: ServiceType) => selectedServices.includes(subService)));
    }

    public calc(selectedServices: ServiceType[], selectedYear: ServiceYear, countedServices: ServiceType[]): PriceResult {
        if (countedServices.includes(this.getNameService())) {
            return { basePrice: 0, finalPrice: 0, countedServices: countedServices };
        }

        const newCountedServices: ServiceType[] = [...countedServices, this.getNameService()];
        const basePrice: number = this.getBasicPrice(selectedYear);
        const discounts: PriceConfigDiscount[] = this.getDiscounts(selectedYear, selectedServices);
        let finalPrice: number = basePrice;

        if (discounts.length > 0) {
            finalPrice = Math.min(...discounts.map((x: PriceConfigDiscount) => x.price));
            newCountedServices.push(...this.getAdditionalServicesToCountedWhenDiscount());
        }

        return { basePrice, finalPrice, countedServices: newCountedServices }
    }

}