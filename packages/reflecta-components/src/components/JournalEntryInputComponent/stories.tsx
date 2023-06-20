import JournalEntryInputComponent from './index';

import {
    IJournalEntryInputComponent, JournalEntry
} from './types';

export default {
    component: JournalEntryInputComponent,
    title: 'Journal Entry Input'
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
