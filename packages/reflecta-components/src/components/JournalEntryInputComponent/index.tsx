import {
    FormEvent,
    useState
} from 'react';

import classNames from '@utils/classNames';

import ButtonComponent from '@components/ButtonComponent';
import FormComponent from '@components/FormComponent';
import InputComponent from '@components/InputComponent';

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
                label={'Title'}
                name={'title'}
                onChange={setTitle}
                type={'text'}
                value={title}
            />
            <InputComponent
                label={'Body'}
                name={'body'}
                onChange={setBody}
                type={'text'}
                value={body}
            />
            <InputComponent
                label={'Date'}
                name={'date'}
                onChange={setDate}
                type={'date'}
                value={date}
            />
            <ButtonComponent
                label={'Discard'}
                onClick={handleReset}
            />
            <ButtonComponent
                label={'Save'}
                type={'submit'}
            />
        </FormComponent>
    );
};

JournalEntryInputComponent.displayName = 'JournalEntryInputComponent';

export default JournalEntryInputComponent;
