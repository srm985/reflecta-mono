import {
    FormEvent,
    useState
} from 'react';

import ButtonComponent from '@components/ButtonComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import FormComponent from '@components/FormComponent';
import InputComponent from '@components/InputComponent';

import classNames from '@utils/classNames';

import {
    IJournalEntryInputComponent
} from './types';

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
    ] = useState('');

    const [
        body,
        setBody
    ] = useState('');

    const [
        date,
        setDate
    ] = useState(now);

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
            <InputComponent
                className={'mb--1'}
                label={'Title'}
                name={'title'}
                onChange={setTitle}
                type={'text'}
                value={title}
            />
            <InputComponent
                className={'mb--1'}
                label={'Body'}
                name={'body'}
                onChange={setBody}
                type={'text'}
                value={body}
            />
            <InputComponent
                className={'mb--2'}
                label={'Date'}
                name={'date'}
                onChange={setDate}
                type={'date'}
                value={date}
            />
            <FlexboxComponent justifyContent={'flex-end'}>
                <ButtonComponent
                    className={'mr--2'}
                    label={'Discard'}
                    onClick={handleReset}
                />
                <ButtonComponent
                    label={'Save'}
                    type={'submit'}
                />
            </FlexboxComponent>
        </FormComponent>
    );
};

JournalEntryInputComponent.displayName = 'JournalEntryInputComponent';

export default JournalEntryInputComponent;
