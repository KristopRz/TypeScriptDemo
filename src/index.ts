import { BlurayPackagePrice } from './price-calculator/bluray-package-price';
import { PhotographyPrice } from './price-calculator/photography-price';
import { PriceCalculator, PriceResult } from "./price-calculator/price-calculator";
import { TwoDayEventPrice } from './price-calculator/two-day-event-price';
import { VideoRecordingPrice } from './price-calculator/video-recording-price';
import { WeddingSessionPrice } from './price-calculator/wedding-session-price';

////////////////////////////////////////////////////// TYPES //////////////////////////////////////////////////////////
export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export type Price = {
    basePrice: number; 
    finalPrice: number;
};

export type RelatedConfigServices = {
    mainService: ServiceType;
    subServices: ServiceType[];
};

export type PriceConfigDiscount = {
    subServices: ServiceType[];
    year: ServiceYear;
    price: number;
};

export type PriceConfigServices = {
    year: ServiceYear;
    price: number;
};

////////////////////////////////////////////////////// CONFIG //////////////////////////////////////////////////////////
const relatedConfigServices: RelatedConfigServices[] = [
    { mainService: 'Photography', subServices: ['TwoDayEvent'] },
    { mainService: 'VideoRecording', subServices: ['BlurayPackage', 'TwoDayEvent'] },
    { mainService: 'BlurayPackage', subServices: [] },
    { mainService: 'TwoDayEvent', subServices: [] },
    { mainService: 'WeddingSession', subServices: [] }
];

const weddingConfigPrice: Record<ServiceType, PriceCalculator> = {
    'Photography': new PhotographyPrice(),
    'VideoRecording': new VideoRecordingPrice(),
    'BlurayPackage': new BlurayPackagePrice(),
    'TwoDayEvent': new TwoDayEventPrice(),
    'WeddingSession': new WeddingSessionPrice()
};

////////////////////////////////////////////////////// PRIVATE LOGIC //////////////////////////////////////////////////////////
function findMainService(service: ServiceType): ServiceType | null {
    const relevantConfigService: RelatedConfigServices | undefined = relatedConfigServices.find((configService: RelatedConfigServices) =>
        configService.subServices.includes(service)
    );

    return relevantConfigService ? relevantConfigService.mainService : null;
}

function findAllMainServices(service: ServiceType): ServiceType[] {
    return relatedConfigServices
        .filter((configService: RelatedConfigServices) => configService.subServices.includes(service))
        .map((configService: RelatedConfigServices) => configService.mainService);
}

function findSubServices(mainService: ServiceType): ServiceType[] {
    const relevantConfigService: RelatedConfigServices | undefined = relatedConfigServices.find((configService: RelatedConfigServices) =>
        configService.mainService === mainService
    );

    return relevantConfigService ? relevantConfigService.subServices : [];
}

function selectAction(previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] {
    const mainService: ServiceType | null = findMainService(service);
    if (mainService !== null && previouslySelectedServices.includes(mainService) === false) {
        return previouslySelectedServices;
    }

    if (previouslySelectedServices.includes(service) === false) {
        return [...previouslySelectedServices, service];
    }

    return previouslySelectedServices;
}

function deselectAction(previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] {
    const subServices: ServiceType[] = findSubServices(service);

    for (const subService of subServices) {
        const otherMainServices: ServiceType[] = findAllMainServices(subService).filter((s: ServiceType) => s !== service);

        if (otherMainServices.some((otherMainService: ServiceType) => previouslySelectedServices.includes(otherMainService))) {
            return previouslySelectedServices.filter((s: ServiceType) => s !== service);
        }
    }

    if (subServices.length > 0) {
        return previouslySelectedServices.filter((s: ServiceType) => s !== service && subServices.includes(s) === false);
    }

    return previouslySelectedServices.filter((s: ServiceType) => s !== service);
}

////////////////////////////////////////////////////// EXPORT METHODS //////////////////////////////////////////////////////////
export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    if (action.type === "Select") {
        return selectAction(previouslySelectedServices, action.service);
    }

    return deselectAction(previouslySelectedServices, action.service);
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear): Price => {
    let basePrice: number = 0;
    let finalPrice: number = 0;
    let countedServices: ServiceType[] = [];

    for (const service of selectedServices) {
        const priceResult: PriceResult = weddingConfigPrice[service].calc(selectedServices, selectedYear, countedServices);
        basePrice += priceResult.basePrice;
        finalPrice += priceResult.finalPrice;
        countedServices = [...priceResult.countedServices];
    }

    return { basePrice, finalPrice };
}


