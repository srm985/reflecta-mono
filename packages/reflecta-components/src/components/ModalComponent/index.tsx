import {
    FC,
    MouseEvent,
    KeyboardEvent as ReactKeyboardEvent,
    useEffect,
    useRef
} from 'react';

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
                tabIndex={0}
            >
                <dialog
                    className={`${displayName}__dialog`}
                    open
                >
                    {children}
                </dialog>
            </div>
        </div>
    );
};

ModalComponent.displayName = 'ModalComponent';

export default ModalComponent;
