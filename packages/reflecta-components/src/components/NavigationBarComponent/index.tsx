import {
    faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';
import PopoverComponent from '@components/PopoverComponent';

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
                <PopoverComponent
                    actions={[
                        {
                            groupActions: [
                                {
                                    actionLabel: 'logout',
                                    label: <><FontAwesomeIcon icon={faArrowRightFromBracket} /> {'Logout'}</>,
                                    onClick: onLogout
                                }
                            ],
                            groupLabel: 'logout'
                        }
                    ]}
                    label={'Options'}
                />
            </FlexboxComponent>
        </nav>
    );
};

NavigationBarComponent.displayName = 'NavigationBarComponent';

export default NavigationBarComponent;
