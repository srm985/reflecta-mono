import React, {
    FC,
    Suspense
} from 'react';
import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';

import AuthenticatedRouteComponent from '@components/enhancers/AuthenticatedRouteComponent';
import ContainerComponent from '@components/enhancers/ContainerComponent';

const LoginView = React.lazy(() => import('@views/LoginView') as unknown as Promise<{ default: FC }>);

const App = () => (
    <Suspense fallback={'loading...'}>
        <BrowserRouter>
            <Routes>
                <Route
                    element={<ContainerComponent />}
                    path={'/'}
                >
                    <Route
                        element={<LoginView />}
                        path={'login'}
                    />
                    <Route element={<AuthenticatedRouteComponent />}>
                        <Route
                            element={<LoginView />}
                            path={'dashboard'}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </Suspense>
);

export default App;
