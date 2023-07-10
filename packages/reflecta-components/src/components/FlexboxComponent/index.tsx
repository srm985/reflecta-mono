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
        children,
        className,
        layoutDefault,
        layoutDesktop
    } = props;

    const {
        displayName
    } = FlexboxComponent;

    const componentClassNames = classNames(
        displayName,
        className,
        {
            [`${displayName}__default--align-items-${layoutDefault?.alignItems}`]: !!layoutDefault?.alignItems,
            [`${displayName}__default--height-full`]: !!layoutDefault?.isFullHeight,
            [`${displayName}__default--flex-direction-${layoutDefault?.flexDirection}`]: !!layoutDefault?.flexDirection,
            [`${displayName}__default--justify-content-${layoutDefault?.justifyContent}`]: !!layoutDefault?.justifyContent,
            [`${displayName}__desktop--align-items-${layoutDesktop?.alignItems}`]: !!layoutDesktop?.alignItems,
            [`${displayName}__desktop--height-full`]: !!layoutDesktop?.isFullHeight,
            [`${displayName}__desktop--flex-direction-${layoutDesktop?.flexDirection}`]: !!layoutDesktop?.flexDirection,
            [`${displayName}__desktop--justify-content-${layoutDesktop?.justifyContent}`]: !!layoutDesktop?.justifyContent
        }
    );

    return (
        <div className={componentClassNames}>{children}</div>
    );
};

FlexboxComponent.displayName = 'FlexboxComponent';

export default FlexboxComponent;
