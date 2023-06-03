import {
    FormEvent
} from 'react';

import ButtonComponent from '../../Components/RemoteComponents/ButtonComponent';
import FormComponent from '../../Components/RemoteComponents/FormComponent';
import InputComponent from '../../Components/RemoteComponents/InputComponent';

import withReducer from './withReducer';

import {
    Action,
    ILoginView
} from './types';

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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(state);
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
