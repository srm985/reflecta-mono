import React, {
    FC,
    Suspense
} from 'react';
import {
    Provider
} from 'react-redux';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import RootStylingComponent from '@components/remotes/RootStylingComponent';

import AuthenticatedRouteComponent from '@components/enhancers/AuthenticatedRouteComponent';
import ContainerComponent from '@components/enhancers/ContainerComponent';

import store from '@store/index';

const DashboardView = React.lazy(() => import('@views/DashboardView') as unknown as Promise<{ default: FC }>);
const LoginView = React.lazy(() => import('@views/LoginView') as unknown as Promise<{ default: FC }>);

const App = () => (
    <Suspense fallback={'loading...'}>
        <RootStylingComponent />
        <Provider
            noopCheck={'always'}
            stabilityCheck={'always'}
            store={store}
        >
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
        </Provider>
    </Suspense>
);

export default App;
