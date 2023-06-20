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

    return (<article className={componentClassNames}>{children}</article>);
};

CardComponent.displayName = 'CardComponent';

export default CardComponent;
