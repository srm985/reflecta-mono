declare module '*.scss';

type BeforeInstallPromptChoice = {
    outcome: 'accepted' | 'dismissed';
    platform: string;
};

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<BeforeInstallPromptChoice>;
};

interface Window {
    reflectaInstallPromptEvent?: BeforeInstallPromptEvent;
}

interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    'reflecta-install-prompt-available': Event;
}
