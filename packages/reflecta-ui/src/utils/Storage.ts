class Storage {
    writeKeyLocal = (key: string, payload: string | object) => {
        window.localStorage.setItem(key, JSON.stringify(payload));
    };

    readKeyLocal = <Payload>(key: string): Payload | undefined => {
        const stringifiedPayload = window.localStorage.getItem(key);

        if (!stringifiedPayload) {
            return undefined;
        }

        try {
            const payload = JSON.parse(stringifiedPayload);

            return payload as Payload;
        } catch (error) {}

        return stringifiedPayload as Payload;
    };

    clearKeyLocal = (key: string) => {
        window.localStorage.removeItem(key);
    };

    clearAllLocal = () => {
        window.localStorage.clear();
    };

    writeKeySession = (key: string, payload: string | object) => {
        window.localStorage.setItem(key, JSON.stringify(payload));
    };

    readKeySession = <Payload>(key: string): Payload | undefined => {
        const stringifiedPayload = window.localStorage.getItem(key);

        if (!stringifiedPayload) {
            return undefined;
        }

        try {
            const payload = JSON.parse(stringifiedPayload);

            return payload as Payload;
        } catch (error) {}

        return stringifiedPayload as Payload;
    };

    clearKeySession = (key: string) => {
        window.localStorage.removeItem(key);
    };

    clearAllSession = () => {
        window.localStorage.clear();
    };
}

export default Storage;
