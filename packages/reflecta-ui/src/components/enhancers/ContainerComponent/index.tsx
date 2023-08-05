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

const authentication = new Authentication();

const ContainerComponent = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authentication.deAuthenticate();

        navigate('/');
    };

    const isAuthenticated = authentication.isAuthenticated();

    const primaryNavigationItem: NavigationItem = {
        icon: faPenToSquare,
        label: 'New Entry',
        onClick: () => {}
    };

    const navigationItemsList: NavigationItem[] = [
        {
            icon: faHouse,
            label: 'Home',
            onClick: () => {}
        },
        {
            icon: faGear,
            label: 'Settings',
            onClick: () => {}
        }
    ];

    return (
        <>
            {isAuthenticated && (
                <ViewportRendererComponent viewportOptions={{
                    breakpointBeginMedium: <NavigationBarComponent onLogout={handleLogout} />
                }}
                >
                    <NavigationMobileComponent
                        navigationItems={navigationItemsList}
                        primaryNavigationItem={primaryNavigationItem}
                    />
                </ViewportRendererComponent>
            )}
            <div className={'mx--2 mt--10'}>
                <Outlet />
            </div>
            <footer />
        </>
    );
};

export default ContainerComponent;
