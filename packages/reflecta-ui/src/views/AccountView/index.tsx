import {
    FC,
    useEffect
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

import ButtonComponent from '@components/remotes/ButtonComponent';
import FieldDisplayComponent from '@components/remotes/FieldDisplayComponent';

import {
    useAppDispatch,
    useAppSelector
} from '@hooks';

import {
    fetchAccountDetails,
    selectAllAccountDetails
} from '@store/slices/accountDetailsSlice';

import Authentication from '@utils/Authentication';

import {
    ROUTE_UI_DEFAULT
} from '@routes';

import {
    IAccountView
} from './types';

import './styles.scss';

const authentication = new Authentication();

const AccountView: FC<IAccountView> = () => {
    const {
        displayName
    } = AccountView;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAccountDetails());
    }, [
        dispatch
    ]);

    const {
        emailAddress,
        firstName,
        lastName
    } = useAppSelector(selectAllAccountDetails);

    const handleLogout = () => {
        authentication.deAuthenticate();

        navigate(ROUTE_UI_DEFAULT);
    };

    return (
        <main className={displayName}>
            <section className={`${displayName}__section`}>
                <div className={`${displayName}__heading`}>
                    <h1>{'Settings'}</h1>
                    <p>{'Manage the basics for your private writing space.'}</p>
                </div>
                <div className={`${displayName}__fields`}>
                    <FieldDisplayComponent
                        label={'First name'}
                        value={firstName}
                    />
                    <FieldDisplayComponent
                        label={'Last name'}
                        value={lastName}
                    />
                    <FieldDisplayComponent
                        label={'Email address'}
                        value={emailAddress}
                    />
                </div>
            </section>
            <section className={`${displayName}__section`}>
                <div className={`${displayName}__heading`}>
                    <h2>{'Account security'}</h2>
                    <p>{'Your password is hidden here. Sign out when you are finished on a shared device.'}</p>
                </div>
                <ButtonComponent
                    color={'danger'}
                    onClick={handleLogout}
                    styleType={'secondary'}
                    type={'button'}
                >{'Log out'}
                </ButtonComponent>
            </section>
            <section className={`${displayName}__section`}>
                <div className={`${displayName}__heading`}>
                    <h2>{'Journal privacy'}</h2>
                    <p>{'Location and drafts are used only to make entries easier to find and continue inside Reflecta.'}</p>
                </div>
            </section>
        </main>
    );
};

AccountView.displayName = 'AccountView';

export default AccountView;
