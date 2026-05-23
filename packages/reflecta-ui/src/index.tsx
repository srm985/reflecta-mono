import {
    INSTALL_PROMPT_AVAILABLE_EVENT
} from '@constants';

const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    window.reflectaInstallPromptEvent = event;
    window.dispatchEvent(new Event(INSTALL_PROMPT_AVAILABLE_EVENT));
};

window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

import('./bootstrap');
