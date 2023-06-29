import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import classNames from '@utils/classNames';

import {
    IButtonBlockComponent
} from './types';

import './styles.scss';

const ButtonBlockComponent: FC<IButtonBlockComponent> = (props) => {
    const {
        children,
        className
    } = props;

    const {
        displayName
    } = ButtonBlockComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <FlexboxComponent
            className={componentClassNames}
            justifyContent={'flex-end'}
        >
            {children}
        </FlexboxComponent>
    );
};

ButtonBlockComponent.displayName = 'ButtonBlockComponent';

export default ButtonBlockComponent;
