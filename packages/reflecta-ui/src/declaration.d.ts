declare module '*.scss';

type BeforeInstallPromptChoice = {
    outcome: 'accepted' | 'dismissed';
    platform: string;
};

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<BeforeInstallPromptChoice>;
};

interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
}
