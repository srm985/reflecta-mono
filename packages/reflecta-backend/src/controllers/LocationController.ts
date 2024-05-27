import GoogleMapsService from '@services/GoogleMapsService';

import CustomError from '@utils/CustomError';

export type LocationRequest = {
    latitude: string;
    longitude: string;
};

export type LocationResponse = {
    location: string;
};

class LocationController {
    private readonly googleMapsService: GoogleMapsService;

    constructor(apiKey: string, locale: string) {
        this.googleMapsService = new GoogleMapsService(apiKey, locale);
    }

    public resolveCityFromCoordinates = async (latitude: string, longitude: string): Promise<string> => {
        const locationDetails = await this.googleMapsService.lookupByCoordinates(latitude, longitude);

        if (!locationDetails) {
            throw new CustomError({
                privateMessage: `No location found given latitude: ${latitude} and longitude: ${longitude}...`,
                statusCode: 404
            });
        }

        const {
            formatted_address: formattedAddress
        } = locationDetails;

        return formattedAddress;
    };
}

export default LocationController;
