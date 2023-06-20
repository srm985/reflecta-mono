import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    Breakpoints,
    IGridItemComponent
} from './types';

import './styles.scss';

const GridItemComponent: FC<IGridItemComponent> = (props) => {
    const {
        children,
        className,
        rowSpan,
        ...breakpoints
    } = props;

    const {
        displayName
    } = GridItemComponent;

    const breakpointClassNames = Object.entries(breakpoints as Breakpoints).reduce((breakpointClasses, [
        breakpointSize,
        breakpointDetails
    ]) => {
        const {
            span,
            start,
            stop
        } = breakpointDetails;

        const breakpointSpan = span ? `${displayName}__${breakpointSize}--span-${span}` : undefined;
        const breakpointStart = `${displayName}__${breakpointSize}--start-${start}`;
        const breakpointStop = stop ? `${displayName}__${breakpointSize}--stop-${stop}` : undefined;

        return classNames(
            breakpointClasses,
            breakpointSpan,
            breakpointStart,
            breakpointStop
        );
    }, '');

    const componentClassNames = classNames(
        displayName,
        className,
        breakpointClassNames
    );

    return (
        <div
            className={componentClassNames}
            style={{
                gridRowEnd: rowSpan ? `span ${rowSpan}` : 'auto'
            }}
        >
            {children}
        </div>
    );
};

GridItemComponent.displayName = 'GridItemComponent';

export default GridItemComponent;
