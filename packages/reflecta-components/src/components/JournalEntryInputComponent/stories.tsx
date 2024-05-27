import axios from 'axios';
import {
    useEffect,
    useState
} from 'react';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import {
    GOOGLE_MAPS_API_KEY
} from '@constants';

import JournalEntryInputComponent from './index';

import {
    IJournalEntryInputComponent,
    JournalEntry
} from './types';

export default {
    component: JournalEntryInputComponent,
    title: 'Journal Entry Input'
};

const Template = (args: IJournalEntryInputComponent) => {
    const handleSubmit = (journalEntry: JournalEntry) => {
        console.log(journalEntry);
    };

    const [
        location,
        setLocation
    ] = useState<string | undefined>();

    const resolveCityFromCoordinates = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get<google.maps.GeocoderResponse>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);

            const locationDetails = response.data.results.find((result) => result.types.includes('administrative_area_level_2'));

            if (!locationDetails) {
                return setLocation(undefined);
            }

            const {
                formatted_address: formattedAddress
            } = locationDetails;

            return setLocation(formattedAddress);
        } catch (error) {
            console.log(error);
        }

        return setLocation(undefined);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((currentLocation) => {
                resolveCityFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
            });
        }
    }, []);

    return (
        <StorybookExampleComponent>
            <JournalEntryInputComponent
                {...args}
                googleMapsAPIKey={GOOGLE_MAPS_API_KEY}
                initialLocation={location}
                onSubmit={handleSubmit}
            />
        </StorybookExampleComponent>
    );
};

export const Default = Template.bind({});
