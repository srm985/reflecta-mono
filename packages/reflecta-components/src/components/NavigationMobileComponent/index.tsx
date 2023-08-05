import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import classNames from '@utils/classNames';

import {
    INavigationMobileComponent, NavigationItem
} from './types';

import './styles.scss';

const NavigationMobileComponent: FC<INavigationMobileComponent> = (props) => {
    const {
        className,
        navigationItems,
        primaryNavigationItem
    } = props;

    const {
        displayName
    } = NavigationMobileComponent;

    const renderNavigationItem = (navigationItem: NavigationItem) => (
        <div key={navigationItem.label}>
            <button type={'button'}>
                <FontAwesomeIcon icon={navigationItem.icon} />
            </button>
        </div>
    );

    const navigationItemsListMidpoint = navigationItems.length / 2;

    const navigationLeftSide = navigationItems?.slice(0, navigationItemsListMidpoint).map(renderNavigationItem);
    const navigationRightSide = navigationItems?.slice(navigationItemsListMidpoint).map(renderNavigationItem);

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <nav className={componentClassNames}>
            <FlexboxComponent layoutDefault={{
                isFullHeight: true,
                justifyContent: 'space-between'
            }}
            >
                <FlexboxComponent
                    className={`${displayName}__side-navigation`}
                    layoutDefault={{
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                >{navigationLeftSide}
                </FlexboxComponent>
                <div className={`${displayName}__primary-navigation`}>
                    {renderNavigationItem(primaryNavigationItem)}
                    <div className={`${displayName}__center-background`} />
                </div>
                <FlexboxComponent
                    className={`${displayName}__side-navigation`}
                    layoutDefault={{
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                >{navigationRightSide}
                </FlexboxComponent>
            </FlexboxComponent>
        </nav>
    );
};

NavigationMobileComponent.displayName = 'NavigationMobileComponent';

export default NavigationMobileComponent;
