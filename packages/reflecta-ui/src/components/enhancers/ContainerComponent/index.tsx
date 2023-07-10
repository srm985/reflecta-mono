import {
    Outlet,
    useNavigate
} from 'react-router-dom';

import NavigationBarComponent from '@components/remotes/NavigationBarComponent';

import Authentication from '@utils/Authentication';

const authentication = new Authentication();

const ContainerComponent = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authentication.deAuthenticate();

        navigate('/');
    };

    const isAuthenticated = authentication.isAuthenticated();

    return (
        <>
            {isAuthenticated && <NavigationBarComponent onLogout={handleLogout} />}
            <div className={'mx--2 mt--10'}>
                <Outlet />
            </div>
            <footer />
        </>
    );
};

export default ContainerComponent;
