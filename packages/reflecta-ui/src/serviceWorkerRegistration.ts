const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
        return;
    }

    const register = () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
    };

    if (document.readyState === 'complete') {
        register();

        return;
    }

    window.addEventListener('load', register, {
        once: true
    });
};

export default registerServiceWorker;
