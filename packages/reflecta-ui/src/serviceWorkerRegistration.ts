const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
    });
};

export default registerServiceWorker;
