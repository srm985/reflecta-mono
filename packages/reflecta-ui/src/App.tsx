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

import AccountView from '@views/AccountView';

import LoadingIndicatorComponent from '@components/remotes/LoadingIndicatorComponent';
import RootStylingComponent from '@components/remotes/RootStylingComponent';

import AuthenticatedRouteComponent from '@components/enhancers/AuthenticatedRouteComponent';
import ContainerComponent from '@components/enhancers/ContainerComponent';

import {
    useAppSelector
} from '@hooks';

import {
    fetchLoadingStatus
} from '@store/slices/loadingSlice';

import {
    ROUTE_UI_ACCOUNT,
    ROUTE_UI_DASHBOARD,
    ROUTE_UI_DEFAULT,
    ROUTE_UI_JOURNAL_ENTRY,
    ROUTE_UI_LOGIN
} from '@routes';

const DashboardView = React.lazy(() => import('@views/DashboardView') as unknown as Promise<{ default: FC }>);
const JournalEntryView = React.lazy(() => import('@views/JournalEntryView') as unknown as Promise<{ default: FC }>);
const LoginView = React.lazy(() => import('@views/LoginView') as unknown as Promise<{ default: FC }>);

const App = () => {
    const isLoading = useAppSelector(fetchLoadingStatus);

    return (
        <Suspense fallback={'loading...'}>
            <RootStylingComponent />
            <LoadingIndicatorComponent isVisible={isLoading} />
            <BrowserRouter>
                <Routes key={window.location.pathname}>
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
                            <Route
                                element={<AccountView />}
                                path={ROUTE_UI_ACCOUNT}
                            />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

export default App;
