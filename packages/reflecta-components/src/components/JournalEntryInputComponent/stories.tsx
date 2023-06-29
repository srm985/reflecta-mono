import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

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
        <StorybookExampleComponent>
            <JournalEntryInputComponent
                {...args}
                onSubmit={handleSubmit}
            />
        </StorybookExampleComponent>
    );
};

export const Default = Template.bind({});
