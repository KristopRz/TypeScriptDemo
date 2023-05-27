import { updateSelectedServices, calculatePrice, ServiceYear, ServiceType, Price } from ".";

describe("updateSelectedServices.select", () => {
    test("should select when not selected", () => {
        const result: ServiceType[] = updateSelectedServices([], { type: "Select", service: "Photography" });
        expect(result).toEqual(["Photography"]);
    });

    test("should not select the same service twice", () => {
        const result: ServiceType[]  = updateSelectedServices(["Photography"], { type: "Select", service: "Photography" });
        expect(result).toEqual(["Photography"]);
    });

    test("should not select related service when main service is not selected", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession"], { type: "Select", service: "BlurayPackage" });
        expect(result).toEqual(["WeddingSession"]);
    });

    test("should select related service when main service is selected", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession", "VideoRecording"], {
            type: "Select",
            service: "BlurayPackage"
        });
        expect(result).toEqual(["WeddingSession", "VideoRecording", "BlurayPackage"]);
    });

    test("should select related service when one of main services is selected", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession", "Photography"], {
            type: "Select",
            service: "TwoDayEvent"
        });
        expect(result).toEqual(["WeddingSession", "Photography", "TwoDayEvent"]);
    });
});

describe("updateSelectedServices.deselect", () => {
    test("should deselect", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession", "Photography"], {
            type: "Deselect",
            service: "Photography"
        });
        expect(result).toEqual(["WeddingSession"]);
    });

    test("should do nothing when service not selected", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession", "Photography"], {
            type: "Deselect",
            service: "TwoDayEvent"
        });
        expect(result).toEqual(["WeddingSession", "Photography"]);
    });

    test("should deselect related when last main service deselected", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession", "Photography", "TwoDayEvent"], {
            type: "Deselect",
            service: "Photography"
        });
        expect(result).toEqual(["WeddingSession"]);
    });

    test("should not deselect related when at least one main service stays selected", () => {
        const result: ServiceType[]  = updateSelectedServices(["WeddingSession", "Photography", "VideoRecording", "TwoDayEvent"], {
            type: "Deselect",
            service: "Photography"
        });
        expect(result).toEqual(["WeddingSession", "VideoRecording", "TwoDayEvent"]);
    });
});

describe.each([2020, 2021, 2022])("calculatePrice.zero (%i)", (year: ServiceYear) => {
    test("should be zero with no services selected", () => {
        const result: Price = calculatePrice([], year);
        expect(result).toEqual({ basePrice: 0, finalPrice: 0 });
    });
});

describe.each([
    ["WeddingSession", 2020, 600],
    ["WeddingSession", 2021, 600],
    ["WeddingSession", 2022, 600],
    ["Photography", 2020, 1700],
    ["Photography", 2021, 1800],
    ["Photography", 2022, 1900],
    ["VideoRecording", 2020, 1700],
    ["VideoRecording", 2021, 1800],
    ["VideoRecording", 2022, 1900]
])("calculatePrice.singleService (%s, %i)", (service: ServiceType, year: ServiceYear, expectedPrice: number) => {
    test("no discount applied", () => {
        const result: Price = calculatePrice([service], year);
        expect(result.basePrice).toBeGreaterThan(0);
        expect(result.finalPrice).toBeGreaterThan(0);
        expect(result.basePrice).toBe(result.finalPrice);
    });

    test("price matches requirements", () => {
        const result: Price = calculatePrice([service], year);
        expect(result).toEqual({ basePrice: expectedPrice, finalPrice: expectedPrice });
    });
});

describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 0]
])("calcularePrice.photographyWithWeddingSessionPrice (%i increase by %i)", (year: ServiceYear, increase: number) => {
    test("price matches requirements", () => {
        const withoutSession: Price = calculatePrice(["Photography"], year);
        const withSession: Price = calculatePrice(["Photography", "WeddingSession"], year);

        const priceChangeWithSession: number = withSession.finalPrice - withoutSession.finalPrice;

        expect(withSession.basePrice).toBeGreaterThan(0);
        expect(withSession.finalPrice).toBeGreaterThan(0);
        expect(priceChangeWithSession).toEqual(increase);
    });

    test("discount applied", () => {
        const withoutSession: Price = calculatePrice(["Photography"], year);
        const onlySession: Price = calculatePrice(["WeddingSession"], year);
        const withSession: Price = calculatePrice(["Photography", "WeddingSession"], year);

        const priceWithoutDiscounts: number = withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
    });
});

describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 300]
])("calcularePrice.videoRecordingWithWeddingSessionPrice (%i increase by %i)", (year: ServiceYear, increase: number) => {
    test("price matches requirements", () => {
        const withoutSession: Price = calculatePrice(["VideoRecording"], year);
        const withSession: Price = calculatePrice(["VideoRecording", "WeddingSession"], year);

        const priceChangeWithSession: number = withSession.finalPrice - withoutSession.finalPrice;

        expect(priceChangeWithSession).toEqual(increase);
    });

    test("discount applied", () => {
        const withoutSession: Price = calculatePrice(["VideoRecording"], year);
        const onlySession: Price = calculatePrice(["WeddingSession"], year);
        const withSession: Price = calculatePrice(["VideoRecording", "WeddingSession"], year);

        const priceWithoutDiscounts: number = withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
    });
});

describe.each([
    [2020, 500],
    [2021, 500],
    [2022, 600]
])("calcularePrice.videoRecordingWithPhotographyPrice (%i increase by %i)", (year: ServiceYear, increase: number) => {
    test("price matches requirements", () => {
        const withoutPhotography: Price = calculatePrice(["VideoRecording"], year);
        const withPhotography: Price = calculatePrice(["VideoRecording", "Photography"], year);

        const priceChangeWithPhotography: number = withPhotography.finalPrice - withoutPhotography.finalPrice;

        expect(priceChangeWithPhotography).toEqual(increase);
    });

    test("discount applied", () => {
        const withoutPhotography: Price = calculatePrice(["VideoRecording"], year);
        const onlyPhotography: Price = calculatePrice(["Photography"], year);
        const withPhotography: Price = calculatePrice(["VideoRecording", "Photography"], year);

        const priceWithoutDiscounts: number = withoutPhotography.finalPrice + onlyPhotography.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withPhotography.finalPrice);
    });
});

describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 0]
])(
    "calcularePrice.videoRecordingWithPhotographyWithSessionPrice (%i increase by %i)",
    (year: ServiceYear, increase: number) => {
        test("price matches requirements", () => {
            const withoutSession: Price = calculatePrice(["VideoRecording", "Photography"], year);
            const withSession: Price = calculatePrice(["VideoRecording", "Photography", "WeddingSession"], year);

            const priceChangeWithSession: number = withSession.finalPrice - withoutSession.finalPrice;

            expect(withSession.basePrice).toBeGreaterThan(0);
            expect(withSession.finalPrice).toBeGreaterThan(0);
            expect(priceChangeWithSession).toEqual(increase);
        });

        test("discount applied", () => {
            const withoutSession: Price = calculatePrice(["VideoRecording", "Photography"], year);
            const onlySession: Price = calculatePrice(["WeddingSession"], year);
            const withSession: Price = calculatePrice(["VideoRecording", "Photography", "WeddingSession"], year);

            const priceWithoutDiscounts: number = withoutSession.finalPrice + onlySession.finalPrice;

            expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
        });
    }
);
