import {
    FC, useEffect, useRef, useState
} from 'react';

import classNames from '@utils/classNames';

import {
    Breakpoint,
    BreakpointOptions,
    IViewportRendererComponent,
    ImportedBreakpoint
} from './types';

import * as breakpoints from '@styles/_units.scss';

const ViewportRendererComponent: FC<IViewportRendererComponent> = (props) => {
    const {
        children,
        className,
        viewportOptions
    } = props;

    const {
        displayName
    } = ViewportRendererComponent;

    const isAwaitingResize = useRef<boolean>();

    const [
        viewportWidth,
        setViewportWidth
    ] = useState<number>(window.innerWidth);

    const updateViewportWidth = () => {
        if (!isAwaitingResize.current) {
            isAwaitingResize.current = true;

            setTimeout(() => {
                setViewportWidth(window.innerWidth);

                isAwaitingResize.current = false;
            }, 250);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', updateViewportWidth);

        return () => window.removeEventListener('resize', updateViewportWidth);
    }, []);

    const breakpointOptions: Breakpoint = {};

    Object.entries(breakpoints as ImportedBreakpoint).forEach(([
        key,
        value
    ]) => {
        breakpointOptions[key.replace(/^breakpoints-/, '') as BreakpointOptions] = value;
    });

    const componentToRender = () => {
        const numerize = (viewportValue: string): number => parseInt(viewportValue.replace('px', ''), 10);

        if (viewportOptions?.breakpointBeginXlarge && viewportWidth >= numerize(breakpointOptions.breakpointBeginXlarge as string)) {
            return viewportOptions.breakpointBeginXlarge;
        }

        if (viewportOptions?.breakpointBeginLarge && viewportWidth >= numerize(breakpointOptions.breakpointBeginLarge as string)) {
            return viewportOptions.breakpointBeginLarge;
        }

        if (viewportOptions?.breakpointBeginMedium && viewportWidth >= numerize(breakpointOptions.breakpointBeginMedium as string)) {
            return viewportOptions.breakpointBeginMedium;
        }

        if (viewportOptions?.breakpointBeginSmall && viewportWidth >= numerize(breakpointOptions.breakpointBeginSmall as string)) {
            return viewportOptions.breakpointBeginSmall;
        }

        return children;
    };

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <div className={componentClassNames}>
            {componentToRender()}
        </div>
    );
};

ViewportRendererComponent.displayName = 'ViewportRendererComponent';

export default ViewportRendererComponent;
