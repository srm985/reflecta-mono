import {
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';
import {
    faGear,
    faHouse
} from '@fortawesome/free-solid-svg-icons';
import {
    Outlet,
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
    ROUTE_UI_DASHBOARD,
    ROUTE_UI_DEFAULT,
    ROUTE_UI_JOURNAL_ENTRY
} from '@routes';

const authentication = new Authentication();

const ContainerComponent = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authentication.deAuthenticate();

        navigate(ROUTE_UI_DEFAULT);
    };

    const isAuthenticated = authentication.isAuthenticated();

    const primaryNavigationItem: NavigationItem = {
        icon: faPenToSquare,
        label: 'New Entry',
        onClick: () => navigate(`${ROUTE_UI_JOURNAL_ENTRY}/create`)
    };

    const navigationItemsList: NavigationItem[] = [
        {
            icon: faHouse,
            label: 'Home',
            onClick: () => navigate(ROUTE_UI_DASHBOARD)
        },
        {
            icon: faGear,
            label: 'Settings',
            onClick: () => {}
        }
    ];

    const navigationComponent = (
        <ViewportRendererComponent>
            <NavigationMobileComponent
                navigationItems={navigationItemsList}
                primaryNavigationItem={primaryNavigationItem}
            />
        </ViewportRendererComponent>
    );

    return (
        <>
            {isAuthenticated && (
                <>
                    <NavigationBarComponent onLogout={handleLogout} />
                    {navigationComponent}
                </>
            )}
            <div className={'mx--2 my--10'}>
                <Outlet />
            </div>
            <footer />
        </>
    );
};

export default ContainerComponent;
