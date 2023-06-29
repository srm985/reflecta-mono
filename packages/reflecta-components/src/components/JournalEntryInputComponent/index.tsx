import {
    FormEvent,
    useState
} from 'react';

import ButtonBlockComponent from '@components/ButtonBlockComponent';
import ButtonComponent from '@components/ButtonComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import FormComponent from '@components/FormComponent';

import classNames from '@utils/classNames';

import {
    IJournalEntryInputComponent
} from './types';

import './styles.scss';

const JournalEntryInputComponent: React.FC<IJournalEntryInputComponent> = (props) => {
    const {
        className,
        onSubmit
    } = props;

    const {
        displayName
    } = JournalEntryInputComponent;

    const now = new Date().toISOString().split('T')[0];

    const [
        title,
        setTitle
    ] = useState<string>('');

    const [
        body,
        setBody
    ] = useState<string>('');

    const [
        date,
        setDate
    ] = useState<string>(now);

    const handleEntrySubmission = (event: FormEvent) => {
        event.preventDefault();

        onSubmit({
            body,
            date,
            title
        });
    };

    const handleReset = () => {
        setBody('');
        setDate(now);
        setTitle('');
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
            <FlexboxComponent
                alignItems={'center'}
                className={`${displayName}__input`}
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
                alignItems={'center'}
                className={`${displayName}__input`}
            >
                <label htmlFor={'date'}>
                    <span>{'Entry date:'}</span>
                </label>
                <input
                    id={'date'}
                    name={'date'}
                    onChange={(event) => setDate(event.target.value)}
                    type={'date'}
                    value={date}
                />
            </FlexboxComponent>
            <textarea
                className={`${displayName}__textarea`}
                name={'body'}
                onChange={(event) => setBody(event.target.value)}
                value={body}
            />
            <ButtonBlockComponent>
                <ButtonComponent
                    color={'danger'}
                    onClick={handleReset}
                    styleType={'inline'}
                >
                    {'Discard'}
                </ButtonComponent>
                <ButtonComponent
                    color={'accent'}
                    type={'submit'}
                >
                    {'Save'}
                </ButtonComponent>
            </ButtonBlockComponent>
        </FormComponent>
    );
};

JournalEntryInputComponent.displayName = 'JournalEntryInputComponent';

export default JournalEntryInputComponent;
