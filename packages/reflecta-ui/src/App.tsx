
import {
    Suspense
} from 'react';
import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';

import LoginView from '@views/LoginView';

import AuthenticatedRouteComponent from '@components/enhancers/AuthenticatedRouteComponent';
import ContainerComponent from '@components/enhancers/ContainerComponent';

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
