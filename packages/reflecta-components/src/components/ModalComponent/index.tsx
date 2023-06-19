// We're disabling these because clicking on the modal background is a nicety and isn't required for screen readers
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
    FC,
    MouseEvent,
    KeyboardEvent as ReactKeyboardEvent,
    useEffect,
    useRef
} from 'react';

import GridContainerComponent from '@components/GridContainerComponent';
import GridItemComponent from '@components/GridItemComponent';

import classNames from '@utils/classNames';

import {
    IModalComponent
} from './types';

import './styles.scss';

const ModalComponent: FC<IModalComponent> = (props) => {
    const {
        children,
        className,
        onClose
    } = props;

    const {
        displayName
    } = ModalComponent;

    const backgroundReference = useRef(null);

    const handleKeyedClose = (event: KeyboardEvent | ReactKeyboardEvent) => {
        const {
            code,
            target
        } = event;

        if ((code === 'Space' && target === backgroundReference.current) || code === 'Escape') {
            onClose();
        }
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        const {
            target
        } = event;

        if (target === backgroundReference.current) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyedClose);

        return document.removeEventListener('keydown', handleKeyedClose);
    }, []);

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <div className={componentClassNames}>
            <div
                className={`${displayName}__background`}
                onClick={handleClick}
                onKeyDown={handleKeyedClose}
                ref={backgroundReference}
                role={'button'}
            />
            <GridContainerComponent
                alignItems={'center'}
                isFullHeight
            >
                <GridItemComponent
                    breakpointLarge={{
                        start: 4,
                        stop: 10
                    }}
                    breakpointMedium={{
                        start: 3,
                        stop: 11
                    }}
                    breakpointXlarge={{
                        start: 4,
                        stop: 10
                    }}
                    className={`${displayName}__dialog-wrapper`}
                >
                    <dialog
                        className={`${displayName}__dialog`}
                        open
                    >
                        {children}
                    </dialog>
                </GridItemComponent>
            </GridContainerComponent>
        </div>
    );
};

ModalComponent.displayName = 'ModalComponent';

export default ModalComponent;
