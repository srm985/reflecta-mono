import {
    FC,
    useEffect
} from 'react';

import FieldDisplayComponent from '@components/remotes/FieldDisplayComponent';
import GridContainerComponent from '@components/remotes/GridContainerComponent';
import GridItemComponent from '@components/remotes/GridItemComponent';

import {
    useAppDispatch, useAppSelector
} from '@hooks';

import {
    fetchAccountDetails, selectAllAccountDetails
} from '@store/slices/accountDetailsSlice';

import {
    IAccountView
} from './types';

const AccountView: FC<IAccountView> = () => {
    const {
        displayName
    } = AccountView;

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAccountDetails());
    }, []);

    const {
        emailAddress,
        firstName,
        lastName,
        password
    } = useAppSelector(selectAllAccountDetails);

    return (
        <main className={displayName}>
            <GridContainerComponent>
                <GridItemComponent className={'mb--2'}>
                    <FieldDisplayComponent
                        label={'First name'}
                        value={firstName}
                    />
                </GridItemComponent>
                <GridItemComponent className={'mb--2'}>
                    <FieldDisplayComponent
                        label={'Last name'}
                        value={lastName}
                    />
                </GridItemComponent>
                <GridItemComponent className={'mb--2'}>
                    <FieldDisplayComponent
                        label={'Email address'}
                        value={emailAddress}
                    />
                </GridItemComponent>
                <GridItemComponent>
                    <FieldDisplayComponent
                        label={'Password'}
                        value={password || ''}
                    />
                </GridItemComponent>
            </GridContainerComponent>
        </main>
    );
};

AccountView.displayName = 'AccountView';

export default AccountView;
