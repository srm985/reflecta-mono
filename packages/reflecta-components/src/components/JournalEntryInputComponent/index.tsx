import {
    faFloppyDisk
} from '@fortawesome/free-regular-svg-icons';
import {
    faChevronDown,
    faCircleCheck,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    usePlacesWidget
} from 'react-google-autocomplete';

import ButtonComponent from '@components/ButtonComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import FormComponent from '@components/FormComponent';

import classNames from '@utils/classNames';
import dateStamp from '@utils/dateStamp';

import {
    AutoSaveStatus,
    IJournalEntryInputComponent,
    Location
} from './types';

import './styles.scss';

const JournalEntryInputComponent: React.FC<IJournalEntryInputComponent> = (props) => {
    const {
        autoSaveIntervalMS = 5000,
        className,
        entryID,
        googleMapsAPIKey,
        initialBody,
        initialLocation,
        initialOccurredAt,
        initialTitle,
        onAutoSave,
        onDiscard,
        onSubmit
    } = props;

    const {
        displayName
    } = JournalEntryInputComponent;

    const now = dateStamp();

    const [
        title,
        setTitle
    ] = useState<string>('');

    const [
        body,
        setBody
    ] = useState<string>('');

    const [
        occurredAt,
        setOccurredAt
    ] = useState<string>(now);

    const [
        location,
        setLocation
    ] = useState<Location | undefined>();

    const [
        isDirty,
        setIsDirty
    ] = useState<boolean>(false);

    const [
        isDetailsOpen,
        setDetailsOpen
    ] = useState<boolean>(false);

    const [
        autoSaveStatus,
        setAutoSaveStatus
    ] = useState<AutoSaveStatus>('idle');

    const autoSaveStatusTimerReference = useRef<NodeJS.Timeout | null>(null);
    const entryIDReference = useRef(entryID);
    const titleReference = useRef(title);
    const occurredAtReference = useRef(occurredAt);
    const locationReference = useRef(location);
    const bodyReference = useRef(body);

    useEffect(() => {
        entryIDReference.current = entryID;
    }, [
        entryID
    ]);

    useEffect(() => {
        titleReference.current = title;
    }, [
        title
    ]);

    useEffect(() => {
        occurredAtReference.current = occurredAt;
    }, [
        occurredAt
    ]);

    useEffect(() => {
        locationReference.current = location;
    }, [
        location
    ]);

    useEffect(() => {
        bodyReference.current = body;
    }, [
        body
    ]);

    const clearAutoSaveStatusTimer = () => {
        if (autoSaveStatusTimerReference.current) {
            clearTimeout(autoSaveStatusTimerReference.current);
        }
    };

    const markDirty = () => {
        clearAutoSaveStatusTimer();
        setIsDirty(true);
        setAutoSaveStatus('unsaved');
    };

    const {
        ref
    } = usePlacesWidget<HTMLInputElement>({
        apiKey: googleMapsAPIKey,
        onPlaceSelected: () => {
            setLocation(ref.current?.value);
            markDirty();
        },
        options: {
            types: []
        }
    });

    const handleSave = async () => {
        clearAutoSaveStatusTimer();
        setAutoSaveStatus('saving');

        try {
            const saveResult = await onAutoSave({
                body: bodyReference.current,
                entryID: entryIDReference.current,
                location: locationReference.current,
                occurredAt: occurredAtReference.current,
                title: titleReference.current
            });

            setAutoSaveStatus(saveResult === false ? 'failed' : 'saved');

            autoSaveStatusTimerReference.current = setTimeout(() => {
                setAutoSaveStatus('idle');
            }, 3000);
        } catch (error) {
            setAutoSaveStatus('failed');
        }
    };

    useEffect(() => {
        if (!isDirty) {
            return undefined;
        }

        const autoSaveInterval = setInterval(() => {
            handleSave();
        }, autoSaveIntervalMS);

        return () => clearInterval(autoSaveInterval);
    }, [
        autoSaveIntervalMS,
        isDirty,
        onAutoSave
    ]);

    useEffect(() => () => clearAutoSaveStatusTimer(), []);

    useEffect(() => {
        setTitle(initialTitle || '');
        setOccurredAt(dateStamp(initialOccurredAt) || now);
        setLocation(initialLocation);
        setBody(initialBody || '');
    }, [
        initialBody,
        initialLocation,
        initialOccurredAt,
        initialTitle
    ]);

    const handleSetDirty = () => {
        markDirty();
    };

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        markDirty();
    };

    const handleOccurredAtChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOccurredAt(event.target.value);
        markDirty();
    };

    const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
        markDirty();
    };

    const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value);
        markDirty();
    };

    const handleEntrySubmission = (event: FormEvent) => {
        event.preventDefault();

        onSubmit({
            body,
            entryID,
            location,
            occurredAt,
            title
        });
    };

    const componentClassNames = classNames(
        displayName,
        className
    );

    const detailsClassNames = classNames(
        `${displayName}__details`,
        {
            [`${displayName}__details--open`]: isDetailsOpen
        }
    );

    const detailsToggleIconClassNames = classNames(
        `${displayName}__details-toggle-icon`,
        {
            [`${displayName}__details-toggle-icon--open`]: isDetailsOpen
        }
    );

    const autoSaveStatusLabel = {
        failed: 'Draft could not save',
        idle: entryID ? 'Editing reflection' : 'New reflection',
        saved: 'Draft saved just now',
        saving: 'Saving draft...',
        unsaved: 'Unsaved changes'
    }[autoSaveStatus];

    const autoSaveStatusIcon = {
        failed: faTriangleExclamation,
        idle: undefined,
        saved: faCircleCheck,
        saving: undefined,
        unsaved: undefined
    }[autoSaveStatus];

    const autoSaveStatusClassNames = classNames(
        `${displayName}__autosave-status`,
        `${displayName}__autosave-status--${autoSaveStatus}`
    );

    return (
        <FormComponent
            className={componentClassNames}
            onDirty={handleSetDirty}
            onSubmit={handleEntrySubmission}
        >
            <header className={`${displayName}__toolbar`}>
                <div className={`${displayName}__toolbar-actions`}>
                    <ButtonComponent
                        color={'neutral'}
                        onClick={onDiscard}
                        styleType={'inline'}
                        type={'button'}
                    >
                        {'Cancel'}
                    </ButtonComponent>
                    <ButtonComponent
                        className={`${displayName}__submit-button`}
                        color={'accent'}
                        type={'submit'}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                        <span>{'Done'}</span>
                    </ButtonComponent>
                </div>
                <p
                    aria-live={'polite'}
                    className={autoSaveStatusClassNames}
                >
                    {autoSaveStatusIcon && (
                        <FontAwesomeIcon icon={autoSaveStatusIcon} />
                    )}
                    <span>{autoSaveStatusLabel}</span>
                </p>
            </header>
            <textarea
                aria-label={'Journal entry'}
                className={`${displayName}__textarea`}
                name={'body'}
                onChange={handleBodyChange}
                placeholder={'What do you want to remember?'}
                value={body}
            />
            <button
                aria-expanded={isDetailsOpen}
                className={`${displayName}__details-toggle`}
                onClick={() => setDetailsOpen(!isDetailsOpen)}
                type={'button'}
            >
                <span>{'Details'}</span>
                <FontAwesomeIcon
                    className={detailsToggleIconClassNames}
                    icon={faChevronDown}
                />
            </button>
            <div className={detailsClassNames}>
                <FlexboxComponent
                    className={`${displayName}__input`}
                    layoutDefault={{
                        alignItems: 'center'
                    }}
                >
                    <label htmlFor={'title'}>
                        <span>{'Title'}</span>
                    </label>
                    <input
                        id={'title'}
                        name={'title'}
                        onChange={handleTitleChange}
                        placeholder={'Optional'}
                        type={'text'}
                        value={title}
                    />
                </FlexboxComponent>
                <FlexboxComponent
                    className={`${displayName}__input`}
                    layoutDefault={{
                        alignItems: 'center'
                    }}
                >
                    <label htmlFor={'date'}>
                        <span>{'Entry date'}</span>
                    </label>
                    <input
                        id={'date'}
                        name={'date'}
                        onChange={handleOccurredAtChange}
                        type={'date'}
                        value={occurredAt}
                    />
                </FlexboxComponent>
                <FlexboxComponent
                    className={`${displayName}__input`}
                    layoutDefault={{
                        alignItems: 'center'
                    }}
                >
                    <label htmlFor={'location'}>
                        <span>{'Location'}</span>
                    </label>
                    <input
                        id={'location'}
                        name={'location'}
                        onChange={handleLocationChange}
                        placeholder={'Optional'}
                        ref={ref}
                        type={'search'}
                        value={location || ''}
                    />
                </FlexboxComponent>
            </div>
        </FormComponent>
    );
};

JournalEntryInputComponent.displayName = 'JournalEntryInputComponent';

export default JournalEntryInputComponent;
