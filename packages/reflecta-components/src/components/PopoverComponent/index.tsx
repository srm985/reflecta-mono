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
        windowDimensions,
        setWindowDimensions
    ] = useState<{ innerHeight: number; innerWidth: number; }>({
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth
    });

    const [
        isPopoverOpen,
        togglePopoverOpen
    ] = useState<boolean>(false);

    const [
        popoverLocation,
        setPopoverLocation
    ] = useState<{ x: number; y: number; }>({
        x: 0,
        y: 0
    });

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowDimensions({
                innerHeight: window.innerHeight,
                innerWidth: window.innerWidth
            });
        };

        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    const controlReference = useRef<HTMLButtonElement>(null);

    console.log({
        windowDimensions
    });

    const handleToggle = () => {
        if (controlReference.current) {
            const {
                height,
                width,
                x,
                y
            } = controlReference.current.getBoundingClientRect();

            let popoverX = x;

            if (x + popoverWidth > windowDimensions.innerWidth) {
                popoverX = x - popoverWidth + width;

                console.log('here...');
            }

            setPopoverLocation({
                x: popoverX,
                y: y + height + 20
            });
        }

        togglePopoverOpen(!isPopoverOpen);
    };

    const controlClassNames = classNames(
        `${displayName}__control`,
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
                    onClick={actionDetails.onClick}
                    type={'button'}
                >{actionDetails.label}
                </button>
            ))}
        </div>
    ));

    return (
        <>
            <button
                aria-label={'open popover'}
                className={controlClassNames}
                onClick={handleToggle}
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
                style={{
                    left: popoverLocation.x,
                    top: popoverLocation.y,
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
                        onClick={() => togglePopoverOpen(!isPopoverOpen)}
                        type={'button'}
                    >
                        <span />
                    </button>
                </FlexboxComponent>
                <div className={`${displayName}__actions`}>{actionItemsList}</div>
            </dialog>
        </>
    );
};

PopoverComponent.displayName = 'PopoverComponent';

export default PopoverComponent;
