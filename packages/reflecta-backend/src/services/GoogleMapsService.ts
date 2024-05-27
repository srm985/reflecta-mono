import axios from 'axios';

class GoogleMapsService {
    private readonly apiKey: string;

    private readonly locale: string;

    private readonly ROUTE_GOOGLE_MAPS: string;

    constructor(apiKey: string, locale: string) {
        const {
            env: {
                ROUTE_GOOGLE_MAPS
            }
        } = process;

        this.apiKey = apiKey;
        this.locale = locale;

        this.ROUTE_GOOGLE_MAPS = ROUTE_GOOGLE_MAPS!;
    }

    public lookupByCoordinates = async (latitude: string, longitude: string): Promise<google.maps.GeocoderResult | undefined> => {
        try {
            const googleMapsHydratedEndpoint = this.ROUTE_GOOGLE_MAPS
                .replace('{LATITUDE}', latitude)
                .replace('{LONGITUDE}', longitude)
                .replace('{LOCALE}', this.locale)
                .replace('{GOOGLE_MAPS_API_KEY}', this.apiKey);

            const {
                data: {
                    results
                }
            } = await axios.get<google.maps.GeocoderResponse>(googleMapsHydratedEndpoint);

            console.log('foo....');
            console.log(results);

            const locationDetails = results.find((result) => result.types.includes('administrative_area_level_2'));

            return locationDetails;
        } catch (error) {
            console.log(error);
        }

        return undefined;
    };
}

export default GoogleMapsService;
