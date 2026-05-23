import {
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';
import {
    faGear,
    faHouse
} from '@fortawesome/free-solid-svg-icons';
import {
    Outlet,
    useLocation,
    useNavigate
} from 'react-router-dom';
import {
    NavigationItem
} from 'reflecta-components/declarations/src/components/NavigationMobileComponent/types';

import NavigationBarComponent from '@components/remotes/NavigationBarComponent';
import NavigationMobileComponent from '@components/remotes/NavigationMobileComponent';
import ViewportRendererComponent from '@components/remotes/ViewportRendererComponent';

import Authentication from '@utils/Authentication';

import {
    ROUTE_UI_ACCOUNT,
    ROUTE_UI_DASHBOARD,
    ROUTE_UI_DEFAULT,
    ROUTE_UI_JOURNAL_ENTRY
} from '@routes';

import './styles.scss';

const authentication = new Authentication();

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
                <Outlet />
            </div>
            <footer />
        </div>
    );
};

export default ContainerComponent;
