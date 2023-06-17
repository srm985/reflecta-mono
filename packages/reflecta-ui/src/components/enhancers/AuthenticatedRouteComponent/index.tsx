import {
    Navigate,
    Outlet
} from 'react-router-dom';

import Authentication from '../../../utils/Authentication';

const authentication = new Authentication();

const AuthenticatedRouteComponent = () => {
    const isAuthenticated = authentication.isAuthenticated();

    return (
        isAuthenticated
            ? <Outlet />
            : <Navigate to={'login'} />
    );
};

export default AuthenticatedRouteComponent;
