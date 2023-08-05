import {
    ReactNode
} from 'react';

export type ImportedBreakpoint = { [key: string]: string };

export type BreakpointOptions = 'breakpointBeginLarge' | 'breakpointBeginMedium' | 'breakpointBeginSmall' | 'breakpointBeginXlarge';

export type Breakpoint = { [key in BreakpointOptions]?: string };

export type ViewportOption = {
    breakpoint: BreakpointOptions;
    component: ReactNode;
};

export type IViewportRendererComponent = {
    children: ReactNode;
    className?: string;
    viewportOptions?: { [key in BreakpointOptions]?: ReactNode };
};
