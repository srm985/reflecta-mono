import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import FlexboxComponent from '@components/FlexboxComponent';

import {
    IGridContainerComponent
} from './types';

import './styles.scss';

const GridContainerComponent: FC<IGridContainerComponent> = (props) => {
    const {
        children,
        className
    } = props;

    const {
        displayName
    } = GridContainerComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <FlexboxComponent
            className={componentClassNames}
            justifyContent={'center'}
        >
            <div className={`${displayName}__grid`}>
                {children}
            </div>
        </FlexboxComponent>
    );
};

GridContainerComponent.displayName = 'GridContainerComponent';

export default GridContainerComponent;
