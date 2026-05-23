import {
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';
import {
    faDownload,
    faEllipsisVertical,
    faGear,
    faHouse,
    faShareFromSquare,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    Outlet,
    useLocation,
    useNavigate
} from 'react-router-dom';
import {
    NavigationItem
} from 'reflecta-components/declarations/src/components/NavigationMobileComponent/types';

import ButtonComponent from '@components/remotes/ButtonComponent';
import NavigationBarComponent from '@components/remotes/NavigationBarComponent';
import NavigationMobileComponent from '@components/remotes/NavigationMobileComponent';
import ViewportRendererComponent from '@components/remotes/ViewportRendererComponent';

import Authentication from '@utils/Authentication';
import Storage from '@utils/Storage';

import {
    ROUTE_UI_ACCOUNT,
    ROUTE_UI_DASHBOARD,
    ROUTE_UI_DEFAULT,
    ROUTE_UI_JOURNAL_ENTRY
} from '@routes';

import {
    INSTALL_PROMPT_AVAILABLE_EVENT,
    LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY
} from '@constants';

import './styles.scss';

type NavigatorStandalone = Navigator & {
    standalone?: boolean;
};

const authentication = new Authentication();
const storage = new Storage();
const containerComponentClassName = 'ContainerComponent';
const ANDROID_MANUAL_PROMPT_DELAY = 1800;
const INSTALL_PROMPT_DISMISSAL_DURATION = 1000 * 60 * 60 * 24 * 7;

const getIsAndroidDevice = (): boolean => /Android/.test(window.navigator.userAgent);

const getIsIOSDevice = (): boolean => {
    const {
        maxTouchPoints,
        platform,
        userAgent
    } = window.navigator;

    return /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
};

const getIsAppInstalled = (): boolean => {
    const navigatorStandalone = window.navigator as NavigatorStandalone;

    return window.matchMedia('(display-mode: standalone)').matches || navigatorStandalone.standalone === true;
};

const getIsInstallPromptDismissed = (): boolean => {
    const dismissedAt = Number(storage.readKeyLocal<string>(LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY));

    if (!Number.isFinite(dismissedAt)) {
        return false;
    }

    return Date.now() - dismissedAt < INSTALL_PROMPT_DISMISSAL_DURATION;
};

const dismissInstallPrompt = () => {
    storage.writeKeyLocal(LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY, Date.now().toString());
};

const InstallAppPrompt: FC = () => {
    const [
        installPromptEvent,
        setInstallPromptEvent
    ] = useState<BeforeInstallPromptEvent | undefined>();

    const [
        isVisible,
        setVisible
    ] = useState<boolean>(false);

    const isAndroidDevice = useMemo(getIsAndroidDevice, []);
    const isAppInstalled = useMemo(getIsAppInstalled, []);
    const isIOSDevice = useMemo(getIsIOSDevice, []);

    useEffect(() => {
        if (isAppInstalled || getIsInstallPromptDismissed()) {
            return undefined;
        }

        const showInstallPrompt = (event: BeforeInstallPromptEvent) => {
            setInstallPromptEvent(event);
            setVisible(true);
        };

        const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            window.reflectaInstallPromptEvent = event;
            showInstallPrompt(event);
        };

        const handleInstallPromptAvailable = () => {
            const event = window.reflectaInstallPromptEvent;

            if (!event) {
                return;
            }

            showInstallPrompt(event);
        };

        const handleAppInstalled = () => {
            window.reflectaInstallPromptEvent = undefined;
            setInstallPromptEvent(undefined);
            setVisible(false);
            dismissInstallPrompt();
        };

        let androidManualPromptTimeoutID: number | undefined;

        if (isIOSDevice || (isAndroidDevice && !window.isSecureContext)) {
            setVisible(true);
        } else if (isAndroidDevice) {
            androidManualPromptTimeoutID = window.setTimeout(() => {
                if (!window.reflectaInstallPromptEvent) {
                    setVisible(true);
                }
            }, ANDROID_MANUAL_PROMPT_DELAY);
        }

        handleInstallPromptAvailable();

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener(INSTALL_PROMPT_AVAILABLE_EVENT, handleInstallPromptAvailable);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            if (androidManualPromptTimeoutID) {
                window.clearTimeout(androidManualPromptTimeoutID);
            }

            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener(INSTALL_PROMPT_AVAILABLE_EVENT, handleInstallPromptAvailable);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [
        isAndroidDevice,
        isAppInstalled,
        isIOSDevice
    ]);

    const handleDismiss = () => {
        dismissInstallPrompt();
        setVisible(false);
    };

    const handleInstall = async () => {
        if (!installPromptEvent) {
            return;
        }

        await installPromptEvent.prompt();

        const {
            outcome
        } = await installPromptEvent.userChoice;

        window.reflectaInstallPromptEvent = undefined;
        setInstallPromptEvent(undefined);
        setVisible(false);

        if (outcome === 'dismissed') {
            dismissInstallPrompt();
        }
    };

    const handleInstallClick = () => {
        handleInstall().catch(() => undefined);
    };

    const isAndroidManualPrompt = isAndroidDevice && !installPromptEvent;
    const isIOSManualPrompt = isIOSDevice && !installPromptEvent;
    const isManualPrompt = isAndroidManualPrompt || isIOSManualPrompt;

    if (!isVisible || (!isManualPrompt && !installPromptEvent)) {
        return null;
    }

    let description = 'Open Reflecta from your home screen and keep writing with fewer browser distractions.';
    let manualPromptIcon = faEllipsisVertical;
    let manualPromptLabel = 'Chrome menu, then Install app';
    let title = 'Install Reflecta';

    if (isIOSManualPrompt) {
        description = "Use Safari's share button, then choose Add to Home Screen.";
        manualPromptIcon = faShareFromSquare;
        manualPromptLabel = 'Share, then Add to Home Screen';
        title = 'Add Reflecta to your home screen';
    } else if (isAndroidManualPrompt) {
        title = 'Install Reflecta from Chrome';

        if (window.isSecureContext) {
            description = "Open Chrome's menu, then choose Install app or Add to Home screen.";
        } else {
            description = 'Open the HTTPS Reflecta site in Chrome to install it on Android.';
            manualPromptLabel = 'Open the HTTPS site in Chrome';
        }
    }

    return (
        <aside
            aria-live={'polite'}
            className={`${containerComponentClassName}__install-prompt`}
        >
            <div className={`${containerComponentClassName}__install-prompt-text`}>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            <div className={`${containerComponentClassName}__install-prompt-actions`}>
                {installPromptEvent ? (
                    <ButtonComponent
                        className={`${containerComponentClassName}__install-action`}
                        onClick={handleInstallClick}
                        type={'button'}
                    >
                        <FontAwesomeIcon icon={faDownload} />
                        <span>{'Install'}</span>
                    </ButtonComponent>
                ) : (
                    <div className={`${containerComponentClassName}__install-manual-action`}>
                        <FontAwesomeIcon icon={manualPromptIcon} />
                        <span>{manualPromptLabel}</span>
                    </div>
                )}
                <ButtonComponent
                    ariaLabel={'Dismiss install prompt'}
                    className={`${containerComponentClassName}__install-dismiss`}
                    isIconOnly
                    onClick={handleDismiss}
                    styleType={'inline'}
                    type={'button'}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </ButtonComponent>
            </div>
        </aside>
    );
};

InstallAppPrompt.displayName = 'InstallAppPrompt';

const ContainerComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        authentication.deAuthenticate();

        navigate(ROUTE_UI_DEFAULT);
    };

    const isAuthenticated = authentication.isAuthenticated();

    const primaryNavigationItem: NavigationItem = {
        ariaLabel: 'Create journal entry',
        icon: faPenToSquare,
        isActive: location.pathname === `${ROUTE_UI_JOURNAL_ENTRY}/create`,
        onClick: () => navigate(`${ROUTE_UI_JOURNAL_ENTRY}/create`)
    };

    const navigationItemsList: NavigationItem[] = [
        {
            icon: faHouse,
            isActive: location.pathname === ROUTE_UI_DASHBOARD,
            label: 'Home',
            onClick: () => navigate(ROUTE_UI_DASHBOARD)
        },
        {
            icon: faGear,
            isActive: location.pathname === ROUTE_UI_ACCOUNT,
            label: 'Settings',
            onClick: () => navigate(ROUTE_UI_ACCOUNT)
        }
    ];

    const navigationComponent = (
        <ViewportRendererComponent viewportOptions={{
            breakpointBeginMedium: <span />
        }}
        >
            <NavigationMobileComponent
                navigationItems={navigationItemsList}
                primaryNavigationItem={primaryNavigationItem}
            />
        </ViewportRendererComponent>
    );

    return (
        <div className={'ContainerComponent'}>
            {isAuthenticated && (
                <>
                    <div className={'ContainerComponent__top-navigation'}>
                        <NavigationBarComponent onLogout={handleLogout} />
                    </div>
                    {navigationComponent}
                </>
            )}
            <div className={'ContainerComponent__content'}>
                <InstallAppPrompt />
                <Outlet />
            </div>
            <footer />
        </div>
    );
};

export default ContainerComponent;
