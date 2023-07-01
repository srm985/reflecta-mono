import {
    FC,
    useEffect,
    useRef,
    useState
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import classNames from '@utils/classNames';

import {
    IPopoverComponent
} from './types';

import './styles.scss';

const PopoverComponent: FC<IPopoverComponent> = (props) => {
    const {
        actions,
        className,
        label,
        popoverWidth = 200
    } = props;

    const {
        displayName
    } = PopoverComponent;

    const [
        isPopoverOpen,
        togglePopoverOpen
    ] = useState<boolean>(false);

    const controlReference = useRef<HTMLButtonElement>(null);
    const dialogReference = useRef<HTMLDialogElement>(null);

    const clickListener = (event: MouseEvent) => {
        if (!dialogReference.current?.contains(event.target as Node)) {
            togglePopoverOpen(false);

            window.removeEventListener('click', clickListener);
        }
    };

    useEffect(() => {
        // Prevent batching to ensure our event listener occurs after toggle open click finishes
        setTimeout(() => {
            if (isPopoverOpen) {
                window.addEventListener('click', clickListener);
            } else {
                window.removeEventListener('click', clickListener);
            }
        }, 0);

        return () => window.removeEventListener('click', clickListener);
    }, [
        isPopoverOpen
    ]);

    const handleActionClick = (onClick: () => void) => {
        onClick();

        togglePopoverOpen(false);
    };

    const {
        bottom: controlLocationBottom = 0,
        left: controlLocationLeft = 0,
        width: controlWidth = 0
    } = controlReference.current?.getBoundingClientRect() || {};

    const popoverPosition = {
        x: controlLocationLeft + popoverWidth > window.innerWidth ? controlWidth - popoverWidth : 0,
        y: controlLocationBottom
    };

    const componentClassNames = classNames(
        displayName,
        className
    );

    const actionItemsList = actions.map((groupDetails) => (
        <div
            className={`${displayName}__action-group`}
            key={groupDetails.groupLabel}
        >
            {groupDetails.groupActions.map((actionDetails) => (
                <button
                    className={`${displayName}__action-item`}
                    key={`${groupDetails.groupLabel}-${actionDetails.label}`}
                    onClick={() => handleActionClick(actionDetails.onClick)}
                    type={'button'}
                >{actionDetails.label}
                </button>
            ))}
        </div>
    ));

    return (
        <div className={componentClassNames}>
            <button
                aria-label={'open popover'}
                className={`${displayName}__control`}
                onClick={() => togglePopoverOpen(!isPopoverOpen)}
                ref={controlReference}
                type={'button'}
            >
                <span />
                <span />
                <span />
            </button>
            <dialog
                className={`${displayName}__popover`}
                open={isPopoverOpen}
                ref={dialogReference}
                style={{
                    left: popoverPosition.x,
                    top: popoverPosition.y,
                    width: popoverWidth
                }}
            >
                <FlexboxComponent
                    alignItems={'flex-start'}
                    justifyContent={'space-between'}
                >
                    <h3>{label}</h3>
                    <button
                        aria-label={'close'}
                        className={`${displayName}__close`}
                        onClick={() => togglePopoverOpen(false)}
                        type={'button'}
                    >
                        <span />
                    </button>
                </FlexboxComponent>
                <div className={`${displayName}__actions`}>{actionItemsList}</div>
            </dialog>
        </div>
    );
};

PopoverComponent.displayName = 'PopoverComponent';

export default PopoverComponent;
