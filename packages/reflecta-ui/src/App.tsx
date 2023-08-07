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

import JournalEntryView from '@views/JournalEntryView';

import RootStylingComponent from '@components/remotes/RootStylingComponent';

import AuthenticatedRouteComponent from '@components/enhancers/AuthenticatedRouteComponent';
import ContainerComponent from '@components/enhancers/ContainerComponent';

import store from '@store/index';

import {
    ROUTE_UI_DASHBOARD, ROUTE_UI_DEFAULT, ROUTE_UI_JOURNAL_ENTRY, ROUTE_UI_LOGIN
} from '@routes';

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
                            element={<Navigate to={ROUTE_UI_DASHBOARD} />}
                            path={ROUTE_UI_DEFAULT}
                        />
                        <Route
                            element={<LoginView />}
                            index
                            path={ROUTE_UI_LOGIN}
                        />
                        <Route element={<AuthenticatedRouteComponent />}>
                            <Route
                                element={<DashboardView />}
                                path={ROUTE_UI_DASHBOARD}
                            />
                            <Route path={ROUTE_UI_JOURNAL_ENTRY}>
                                <Route
                                    element={<JournalEntryView />}
                                    path={'edit/:entryID'}
                                />
                                <Route
                                    element={<JournalEntryView />}
                                    path={'create'}
                                />

                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </Suspense>
);

export default App;
