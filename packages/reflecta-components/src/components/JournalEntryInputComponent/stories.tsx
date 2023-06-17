import JournalEntryInputComponent from './index';

import {
    IJournalEntryInputComponent, JournalEntry
} from './types';

export default {
    component: JournalEntryInputComponent,
    title: 'JournalEntryInputComponent'
};

const Template = (args: IJournalEntryInputComponent) => {
    const handleSubmit = (journalEntry: JournalEntry) => {
        console.log(journalEntry);
    };

    return (
        <JournalEntryInputComponent
            {...args}
            onSubmit={handleSubmit}
        />
    );
};

export const Default = Template.bind({});
