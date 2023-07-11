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
            [`${displayName}__default--flex-wrap-${layoutDefault?.flexWrap}`]: !!layoutDefault?.flexWrap,
            [`${displayName}__default--justify-content-${layoutDefault?.justifyContent}`]: !!layoutDefault?.justifyContent,
            [`${displayName}__default--column-gap-${layoutDefault?.columnGap}`]: !!layoutDefault?.columnGap,
            [`${displayName}__default--row-gap-${layoutDefault?.rowGap}`]: !!layoutDefault?.rowGap,
            [`${displayName}__desktop--align-items-${layoutDesktop?.alignItems}`]: !!layoutDesktop?.alignItems,
            [`${displayName}__desktop--height-full`]: !!layoutDesktop?.isFullHeight,
            [`${displayName}__desktop--flex-direction-${layoutDesktop?.flexDirection}`]: !!layoutDesktop?.flexDirection,
            [`${displayName}__desktop--flex-wrap-${layoutDesktop?.flexWrap}`]: !!layoutDesktop?.flexWrap,
            [`${displayName}__desktop--justify-content-${layoutDesktop?.justifyContent}`]: !!layoutDesktop?.justifyContent,
            [`${displayName}__desktop--column-gap-${layoutDesktop?.columnGap}`]: !!layoutDesktop?.columnGap,
            [`${displayName}__desktop--row-gap-${layoutDesktop?.rowGap}`]: !!layoutDesktop?.rowGap
        }
    );

    return (
        <div className={componentClassNames}>{children}</div>
    );
};

FlexboxComponent.displayName = 'FlexboxComponent';

export default FlexboxComponent;
