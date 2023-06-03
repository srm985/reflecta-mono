import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';

import ContainerComponent from './Components/HigherOrderComponents/ContainerComponent';
import LoginView from './Views/LoginView';

const App = () => (
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
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
