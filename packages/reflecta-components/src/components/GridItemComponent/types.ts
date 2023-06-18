import {
    ReactNode
} from 'react';

export type Breakpoint = 'breakpointSmall' | 'breakpointMedium' | 'breakpointLarge' | 'breakpointXlarge';

export type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Column = ColumnSpan | 13;

export type StartSpan = {
    span: ColumnSpan;
    start: Column;
    stop?: never;
};

export type RelativeSpan = {
    span: ColumnSpan;
    start?: never;
    stop?: never;
};

export type Fixed = {
    span?: never;
    start: Column;
    stop: Column;
};

export type BreakpointOptions = StartSpan | RelativeSpan | Fixed;

export type Breakpoints = {
    [key in Breakpoint]?: BreakpointOptions;
};

export interface IGridItemComponent extends Breakpoints {
    children: ReactNode | ReactNode[];
    className?: string;
}
