import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    ICardComponent
} from './types';

import './styles.scss';

const CardComponent: FC<ICardComponent> = (props) => {
    const {
        children,
        className
    } = props;

    const {
        displayName
    } = CardComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (<div className={componentClassNames}>{children}</div>);
};

CardComponent.displayName = 'CardComponent';

export default CardComponent;
