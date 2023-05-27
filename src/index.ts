import { BlurayPackagePrice } from './price-calculator/bluray-package-price';
import { PhotographyPrice } from './price-calculator/photography-price';
import { PriceCalculator } from "./price-calculator/price-calculator";
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

////////////////////////////////////////////////////// SELECT LOGIC //////////////////////////////////////////////////////////
function verifyMainService(service: ServiceType, previouslySelectedServices: ServiceType[]): boolean {
    const relevantConfigService = relatedConfigServices.find(configService =>
        configService.subServices.includes(service)
    );
    
    return relevantConfigService === undefined || previouslySelectedServices.includes(relevantConfigService.mainService);
}

function selectAction(previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] {
    if (verifyMainService(service, previouslySelectedServices) && previouslySelectedServices.includes(service) === false) {
        return [...previouslySelectedServices, service];
    }

    return previouslySelectedServices;
}

////////////////////////////////////////////////////// DESELECT LOGIC //////////////////////////////////////////////////////////
function findAllMainServices(subService: ServiceType): ServiceType[] {
    return relatedConfigServices
        .filter(configService => configService.subServices.includes(subService))
        .map(configService => configService.mainService);
}

function findSubServices(mainService: ServiceType): ServiceType[] {
    const relevantConfigService = relatedConfigServices.find(configService =>
        configService.mainService === mainService
    );

    return relevantConfigService ? relevantConfigService.subServices : [];
}

function findExclusiveSubServices(previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] {
    const subServices = findSubServices(service);

    return subServices.filter(subService => {
        const otherMainServices = findAllMainServices(subService).filter(mainService => mainService !== service);
        return otherMainServices.some(otherMainService => previouslySelectedServices.includes(otherMainService)) === false;
    });
}

function deselectAction(previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] {
    const subServicesToDeselect = findExclusiveSubServices(previouslySelectedServices, service);
    return previouslySelectedServices.filter(selectedService => selectedService !== service && subServicesToDeselect.includes(selectedService) === false);
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
    let basePrice = 0;
    let finalPrice = 0;
    let countedServices: ServiceType[] = [];

    for (const service of selectedServices) {
        const priceResult = weddingConfigPrice[service].calc(selectedServices, selectedYear, countedServices);
        basePrice += priceResult.basePrice;
        finalPrice += priceResult.finalPrice;
        countedServices = [...priceResult.countedServices];
    }

    return { basePrice, finalPrice };
}


