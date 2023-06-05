import {
    FormEvent
} from 'react';

import Client from '@utils/Client';

import ButtonComponent from '@components/remotes/ButtonComponent';
import FormComponent from '@components/remotes/FormComponent';
import InputComponent from '@components/remotes/InputComponent';

import {
    ROUTE_API_LOGIN
} from '@routes';

import withReducer from './withReducer';

import {
    Action,
    ILoginView
} from './types';

const client = new Client();

const LoginView: React.FC<ILoginView> = (props) => {
    const {
        dispatch,
        state
    } = props;

    const handleChange = (action: Action) => {
        const {
            payload,
            type
        } = action;

        dispatch({
            payload,
            type
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const {
            emailAddress,
            password
        } = state;

        const payload = await client.post(ROUTE_API_LOGIN, {
            emailAddress,
            password
        });

        console.log({
            payload
        });
    };

    return (
        <FormComponent onSubmit={handleSubmit}>
            <InputComponent
                label={'Email Address'}
                name={'emailAddress'}
                onChange={(payload) => handleChange({
                    payload,
                    type: 'UPDATE_EMAIL_ADDRESS'
                })}
                type={'email'}
                value={state.emailAddress}
            />
            <InputComponent
                label={'Password'}
                name={'password'}
                onChange={(payload) => handleChange({
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
    );
};

export default withReducer(LoginView);
