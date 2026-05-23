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

    const renderNavigationItem = (navigationItem: NavigationItem, isPrimary = false) => {
        const navigationItemClassNames = classNames(
            `${displayName}__navigation-item`,
            {
                [`${displayName}__navigation-item--active`]: !!navigationItem.isActive,
                [`${displayName}__navigation-item--primary`]: isPrimary
            }
        );

        return (
            <div key={navigationItem.label}>
                <button
                    aria-current={navigationItem.isActive ? 'page' : undefined}
                    aria-label={navigationItem.label}
                    className={navigationItemClassNames}
                    onClick={navigationItem.onClick}
                    title={navigationItem.label}
                    type={'button'}
                >
                    <FontAwesomeIcon icon={navigationItem.icon} />
                    <span>{navigationItem.label}</span>
                </button>
            </div>
        );
    };

    const navigationItemsListMidpoint = navigationItems.length / 2;

    const navigationLeftSide = navigationItems?.slice(0, navigationItemsListMidpoint).map((navigationItem) => renderNavigationItem(navigationItem));
    const navigationRightSide = navigationItems?.slice(navigationItemsListMidpoint).map((navigationItem) => renderNavigationItem(navigationItem));

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <nav
            aria-label={'Primary'}
            className={componentClassNames}
        >
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
                    {renderNavigationItem(primaryNavigationItem, true)}
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
