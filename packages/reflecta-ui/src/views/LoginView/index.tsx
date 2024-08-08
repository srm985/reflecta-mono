import {
    FormEvent,
    memo,
    useEffect,
    useState
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

import ButtonBlockComponent from '@components/remotes/ButtonBlockComponent';
import ButtonComponent from '@components/remotes/ButtonComponent';
import FormComponent from '@components/remotes/FormComponent';
import InputComponent from '@components/remotes/InputComponent';

import {
    useAppDispatch
} from '@hooks';

import {
    requestLoadingHide,
    requestLoadingShow
} from '@store/slices/loadingSlice';

import Authentication from '@utils/Authentication';
import Client from '@utils/Client';

import {
    ROUTE_API_LOGIN, ROUTE_UI_DASHBOARD
} from '@routes';

import {
    ILoginView,
    LoginResponsePayload
} from './types';

const authentication = new Authentication();
const client = new Client();

const LoginView: React.FC<ILoginView> = () => {
    const [
        emailAddress,
        setEmailAddress
    ] = useState<string>('');

    const [
        password,
        setPassword
    ] = useState<string>('');

    const [
        isAuthenticated,
        setIsAuthenticated
    ] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(requestLoadingShow());

        const isAlreadyAuthenticated = authentication.isAuthenticated();

        if (isAlreadyAuthenticated) {
            setIsAuthenticated(true);
        }

        dispatch(requestLoadingHide());
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTE_UI_DASHBOARD);
        }
    }, [
        isAuthenticated
    ]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(requestLoadingShow());

        try {
            const payload = await client.post<LoginResponsePayload>(ROUTE_API_LOGIN, {
                emailAddress,
                password
            });

            authentication.authenticate(payload.tokenSignature);

            setIsAuthenticated(true);
        } catch (error) {
            dispatch(requestLoadingHide());

            console.log(error);
        }
    };

    const {
        displayName
    } = LoginView;

    return (
        <main className={displayName}>
            <FormComponent onSubmit={handleSubmit}>
                <InputComponent
                    autoCompleteType={'username'}
                    label={'Email Address'}
                    name={'emailAddress'}
                    onChange={setEmailAddress}
                    type={'email'}
                    value={emailAddress}
                />
                <InputComponent
                    autoCompleteType={'current-password'}
                    className={'mt--2'}
                    label={'Password'}
                    name={'password'}
                    onChange={setPassword}
                    type={'password'}
                    value={password}
                />
                <ButtonBlockComponent className={'mt--4'}>
                    <ButtonComponent type={'submit'}>{'Login'}</ButtonComponent>
                </ButtonBlockComponent>
            </FormComponent>
        </main>
    );
};

LoginView.displayName = 'LoginView';

export default memo(LoginView);
