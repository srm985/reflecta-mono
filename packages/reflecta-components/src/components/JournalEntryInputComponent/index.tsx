import {
    faFloppyDisk
} from '@fortawesome/free-regular-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FormEvent,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    usePlacesWidget
} from 'react-google-autocomplete';

import ButtonBlockComponent from '@components/ButtonBlockComponent';
import ButtonComponent from '@components/ButtonComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import FormComponent from '@components/FormComponent';

import classNames from '@utils/classNames';
import dateStamp from '@utils/dateStamp';

import {
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
        intervalID,
        setIntervalID
    ] = useState<NodeJS.Timeout | null>(null);

    const [
        isDirty,
        setIsDirty
    ] = useState<boolean>(false);

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

    const {
        ref
    } = usePlacesWidget<HTMLInputElement>({
        apiKey: googleMapsAPIKey,
        onPlaceSelected: (selectedLocation) => {
            setLocation(selectedLocation.formatted_address);
        },
        options: {
            types: []
        }
    });

    const handleSave = () => {
        onAutoSave({
            body: bodyReference.current,
            entryID: entryIDReference.current,
            location: locationReference.current,
            occurredAt: occurredAtReference.current,
            title: titleReference.current
        });
    };

    useEffect(() => {
        if (!isDirty || (isDirty && intervalID)) {
            return undefined;
        }

        const autoSaveInterval = setInterval(() => {
            handleSave();
        }, autoSaveIntervalMS);

        setIntervalID(autoSaveInterval);

        return () => clearInterval(autoSaveInterval);
    }, [
        isDirty
    ]);

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
        setIsDirty(true);
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

    return (
        <FormComponent
            className={componentClassNames}
            onDirty={handleSetDirty}
            onSubmit={handleEntrySubmission}
        >
            <FlexboxComponent>
                <ButtonBlockComponent
                    className={'mb--2'}
                    isAlwaysInline
                >
                    <ButtonComponent
                        color={'danger'}
                        onClick={onDiscard}
                        styleType={'inline'}
                        type={'button'}
                    >
                        {'discard'}
                    </ButtonComponent>
                    <ButtonComponent
                        color={'accent'}
                        styleType={'inline'}
                        type={'submit'}
                    >
                        <FontAwesomeIcon
                            className={'font--large'}
                            icon={faFloppyDisk}
                        />
                    </ButtonComponent>
                </ButtonBlockComponent>
            </FlexboxComponent>
            <FlexboxComponent
                className={`${displayName}__input`}
                layoutDefault={{
                    alignItems: 'center'
                }}
            >
                <label htmlFor={'title'}>
                    <span>{'Title (optional):'}</span>
                </label>
                <input
                    id={'title'}
                    name={'title'}
                    onChange={(event) => setTitle(event.target.value)}
                    type={'search'}
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
                    <span>{'Entry date:'}</span>
                </label>
                <input
                    id={'date'}
                    name={'date'}
                    onChange={(event) => setOccurredAt(event.target.value)}
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
                    <span>{'Location:'}</span>
                </label>
                <input
                    id={'location'}
                    name={'location'}
                    onChange={(event) => setLocation(event.target.value)}
                    ref={ref}
                    type={'search'}
                    value={location}
                />
            </FlexboxComponent>
            <textarea
                className={`${displayName}__textarea`}
                name={'body'}
                onChange={(event) => setBody(event.target.value)}
                value={body}
            />
        </FormComponent>
    );
};

JournalEntryInputComponent.displayName = 'JournalEntryInputComponent';

export default JournalEntryInputComponent;
