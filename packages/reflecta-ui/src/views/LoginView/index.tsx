import {
    FormEvent,
    memo,
    useEffect
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

import ButtonComponent from '@components/remotes/ButtonComponent';
import FormComponent from '@components/remotes/FormComponent';
import InputComponent from '@components/remotes/InputComponent';

import Authentication from '@utils/Authentication';
import Client from '@utils/Client';

import {
    ROUTE_API_LOGIN
} from '@routes';

import withReducer from './withReducer';

import {
    ILoginView,
    LoginResponsePayload
} from './types';

const authentication = new Authentication();
const client = new Client();

const LoginView: React.FC<ILoginView> = (props) => {
    const {
        dispatch,
        state
    } = props;

    const {
        displayName
    } = LoginView;

    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = authentication.isAuthenticated();

        if (isAuthenticated) {
            dispatch({
                type: 'SET_AUTHENTICATED'
            });
        }
    }, []);

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate('/dashboard');
        }
    }, [
        state.isAuthenticated
    ]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const {
            emailAddress,
            password
        } = state;

        const payload = await client.post<LoginResponsePayload>(ROUTE_API_LOGIN, {
            emailAddress,
            password
        });

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            authentication.authenticate(payload.tokenSignature);

            dispatch({
                type: 'SET_AUTHENTICATED'
            });
        }
    };

    return (
        <main className={displayName}>
            <FormComponent onSubmit={handleSubmit}>
                <InputComponent
                    autoCompleteType={'username'}
                    label={'Email Address'}
                    name={'emailAddress'}
                    onChange={(payload) => dispatch({
                        payload,
                        type: 'UPDATE_EMAIL_ADDRESS'
                    })}
                    type={'email'}
                    value={state.emailAddress}
                />
                <InputComponent
                    autoCompleteType={'current-password'}
                    label={'Password'}
                    name={'password'}
                    onChange={(payload) => dispatch({
                        payload,
                        type: 'UPDATE_PASSWORD'
                    })}
                    type={'password'}
                    value={state.password}
                />
                <ButtonComponent
                    label={'Login'}
                    type={'submit'}
                />
            </FormComponent>
        </main>
    );
};

LoginView.displayName = 'LoginView';

export default withReducer(memo(LoginView));
