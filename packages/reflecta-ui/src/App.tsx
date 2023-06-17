import React, {
    FC,
    Suspense
} from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import RootStylingComponent from '@components/remotes/RootStylingComponent';

import AuthenticatedRouteComponent from '@components/enhancers/AuthenticatedRouteComponent';
import ContainerComponent from '@components/enhancers/ContainerComponent';

const DashboardView = React.lazy(() => import('@views/DashboardView') as unknown as Promise<{ default: FC }>);
const LoginView = React.lazy(() => import('@views/LoginView') as unknown as Promise<{ default: FC }>);

const App = () => (
    <Suspense fallback={'loading...'}>
        <RootStylingComponent />
        <BrowserRouter>
            <Routes>
                <Route element={<ContainerComponent />}>
                    <Route
                        element={<Navigate to={'/dashboard'} />}
                        path={'/'}
                    />
                    <Route
                        element={<LoginView />}
                        index
                        path={'/login'}
                    />
                    <Route element={<AuthenticatedRouteComponent />}>
                        <Route
                            element={<DashboardView />}
                            path={'/dashboard'}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </Suspense>
);

export default App;
