import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    IFlexboxComponent
} from './types';

import './styles.scss';

const FlexboxComponent: FC<IFlexboxComponent> = (props) => {
    const {
        alignItems,
        children,
        className,
        flexDirection,
        justifyContent
    } = props;

    const {
        displayName
    } = FlexboxComponent;

    const componentClassNames = classNames(
        displayName,
        className,
        {
            [`${displayName}__align-items--${alignItems}`]: !!alignItems,
            [`${displayName}__flex-direction--${flexDirection}`]: !!flexDirection,
            [`${displayName}__justify-content--${justifyContent}`]: !!justifyContent
        }
    );

    return (
        <div className={componentClassNames}>{children}</div>
    );
};

FlexboxComponent.displayName = 'FlexboxComponent';

export default FlexboxComponent;
