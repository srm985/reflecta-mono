import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import classNames from '@utils/classNames';

import {
    IGridContainerComponent
} from './types';

import './styles.scss';

const GridContainerComponent: FC<IGridContainerComponent> = (props) => {
    const {
        alignItems,
        children,
        className,
        isFullHeight,
        rowHeight
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
            alignItems={alignItems}
            className={componentClassNames}
            isFullHeight={isFullHeight}
            justifyContent={'center'}
        >
            <div
                className={`${displayName}__grid`}
                style={{
                    gridTemplateRows: rowHeight
                }}
            >
                {children}
            </div>
        </FlexboxComponent>
    );
};

GridContainerComponent.displayName = 'GridContainerComponent';

export default GridContainerComponent;
