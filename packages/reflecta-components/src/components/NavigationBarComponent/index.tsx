import {
    FC
} from 'react';

import ButtonComponent from '@components/ButtonComponent';
import FlexboxComponent from '@components/FlexboxComponent';

import {
    INavigationBarComponent
} from './types';

import './styles.scss';

const NavigationBarComponent: FC<INavigationBarComponent> = (props) => {
    const {
        onLogout
    } = props;

    const {
        displayName
    } = NavigationBarComponent;

    return (
        <nav className={displayName}>
            <FlexboxComponent justifyContent={'flex-end'}>
                <ButtonComponent
                    onClick={onLogout}
                    styleType={'inline'}
                >
                    {'logout'}
                </ButtonComponent>
            </FlexboxComponent>
        </nav>
    );
};

NavigationBarComponent.displayName = 'NavigationBarComponent';

export default NavigationBarComponent;
