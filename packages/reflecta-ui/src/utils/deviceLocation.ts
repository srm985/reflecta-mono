const deviceLocation = async (): Promise<GeolocationPosition | undefined> => {
    if (!navigator.geolocation) {
        return undefined;
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

export default deviceLocation;
