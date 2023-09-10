import {
    faFloppyDisk,
    faTrashCan
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

import ButtonBlockComponent from '@components/ButtonBlockComponent';
import ButtonComponent from '@components/ButtonComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import FormComponent from '@components/FormComponent';

import classNames from '@utils/classNames';
import dateStamp from '@utils/dateStamp';

import {
    IJournalEntryInputComponent
} from './types';

import './styles.scss';

const JournalEntryInputComponent: React.FC<IJournalEntryInputComponent> = (props) => {
    const {
        autoSaveIntervalMS = 5000,
        className,
        entryID,
        initialBody,
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

    const entryIDReference = useRef(entryID);
    const titleReference = useRef(title);
    const bodyReference = useRef(body);
    const occurredAtReference = useRef(occurredAt);

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
        bodyReference.current = body;
    }, [
        body
    ]);

    useEffect(() => {
        occurredAtReference.current = occurredAt;
    }, [
        occurredAt
    ]);

    const handleSave = () => {
        onAutoSave({
            body: bodyReference.current,
            entryID: entryIDReference.current,
            occurredAt: occurredAtReference.current,
            title: titleReference.current
        });
    };

    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            handleSave();
        }, autoSaveIntervalMS);

        return () => clearInterval(autoSaveInterval);
    }, []);

    useEffect(() => {
        if (initialBody) {
            setBody(initialBody);
        }

        if (initialOccurredAt) {
            setOccurredAt((initialOccurredAt || '').split('T')[0]);
        }

        if (initialTitle) {
            setTitle(initialTitle);
        }
    }, [
        initialBody,
        initialOccurredAt,
        initialTitle
    ]);

    const handleEntrySubmission = (event: FormEvent) => {
        event.preventDefault();

        onSubmit({
            body,
            entryID,
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
                        <FontAwesomeIcon
                            className={'font--large'}
                            icon={faTrashCan}
                        />
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
