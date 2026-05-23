import {
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';
import {
    faDownload,
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
    LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY
} from '@constants';

import './styles.scss';

type NavigatorStandalone = Navigator & {
    standalone?: boolean;
};

const authentication = new Authentication();
const storage = new Storage();
const containerComponentClassName = 'ContainerComponent';

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

const getIsInstallPromptDismissed = (): boolean => (
    storage.readKeyLocal<string>(LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY) === 'dismissed'
);

const InstallAppPrompt: FC = () => {
    const [
        installPromptEvent,
        setInstallPromptEvent
    ] = useState<BeforeInstallPromptEvent | undefined>();

    const [
        isVisible,
        setVisible
    ] = useState<boolean>(false);

    const isAppInstalled = useMemo(getIsAppInstalled, []);
    const isIOSDevice = useMemo(getIsIOSDevice, []);

    useEffect(() => {
        if (isAppInstalled || getIsInstallPromptDismissed()) {
            return undefined;
        }

        const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            setInstallPromptEvent(event);
            setVisible(true);
        };

        const handleAppInstalled = () => {
            setInstallPromptEvent(undefined);
            setVisible(false);
            storage.writeKeyLocal(LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY, 'dismissed');
        };

        if (isIOSDevice && window.isSecureContext) {
            setVisible(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [
        isAppInstalled,
        isIOSDevice
    ]);

    const handleDismiss = () => {
        storage.writeKeyLocal(LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY, 'dismissed');
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

        setInstallPromptEvent(undefined);
        setVisible(false);

        if (outcome === 'dismissed') {
            storage.writeKeyLocal(LOCAL_STORAGE_INSTALL_PROMPT_DISMISSED_KEY, 'dismissed');
        }
    };

    const handleInstallClick = () => {
        handleInstall().catch(() => undefined);
    };

    const isIOSManualPrompt = isIOSDevice && !installPromptEvent;

    if (!isVisible || (!isIOSManualPrompt && !installPromptEvent)) {
        return null;
    }

    let description = 'Open Reflecta from your home screen and keep writing with fewer browser distractions.';
    let title = 'Install Reflecta';

    if (isIOSManualPrompt) {
        description = "Use Safari's share button, then choose Add to Home Screen.";
        title = 'Add Reflecta to your home screen';
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
                        <FontAwesomeIcon icon={faShareFromSquare} />
                        <span>{'Share, then Add to Home Screen'}</span>
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
