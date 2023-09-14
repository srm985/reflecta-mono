import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import type {
    Layout
} from '@components/FlexboxComponent/types';

import classNames from '@utils/classNames';

import {
    IButtonBlockComponent
} from './types';

import './styles.scss';

const ButtonBlockComponent: FC<IButtonBlockComponent> = (props) => {
    const {
        children,
        className,
        isAlwaysInline
    } = props;

    const {
        displayName
    } = ButtonBlockComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    const layoutDefault: Layout | undefined = !isAlwaysInline ? ({
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        rowGap: 'medium'
    }) : ({
        columnGap: 'large',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    });

    const layoutDesktop: Layout | undefined = !isAlwaysInline ? ({
        columnGap: 'large',
        flexDirection: 'row'
    }) : undefined;

    return (
        <FlexboxComponent
            className={componentClassNames}
            layoutDefault={layoutDefault}
            layoutDesktop={layoutDesktop}
        >
            {children}
        </FlexboxComponent>
    );
};

ButtonBlockComponent.displayName = 'ButtonBlockComponent';

export default ButtonBlockComponent;
