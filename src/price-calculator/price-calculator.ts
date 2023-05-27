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
        const basicPriceConfig = this.getBasicPriceConfig();
        const selectedPriceConfig = basicPriceConfig.find(x => x.year === selectedYear);
        return selectedPriceConfig ? selectedPriceConfig.price : 0;
    }

    private getDiscounts(selectedYear: ServiceYear, selectedServices: ServiceType[]): PriceConfigDiscount[] {
        const discountsConfig = this.getDiscountsConfig();
        return discountsConfig.filter(x => x.year === selectedYear &&
            x.subServices.every(subService => selectedServices.includes(subService)));
    }

    public calc(selectedServices: ServiceType[], selectedYear: ServiceYear, countedServices: ServiceType[]): PriceResult {
        if (countedServices.includes(this.getNameService())) {
            return { basePrice: 0, finalPrice: 0, countedServices: countedServices };
        }

        const newCountedServices = [...countedServices, this.getNameService()];
        const basePrice = this.getBasicPrice(selectedYear);
        const discounts = this.getDiscounts(selectedYear, selectedServices);
        let finalPrice = basePrice;

        if (discounts.length > 0) {
            finalPrice = Math.min(...discounts.map(discount => discount.price));
            newCountedServices.push(...this.getAdditionalServicesToCountedWhenDiscount());
        }

        return { basePrice, finalPrice, countedServices: newCountedServices }
    }

}