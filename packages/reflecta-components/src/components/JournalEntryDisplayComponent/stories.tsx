import JournalEntryDisplayComponent from './index';

import {
    IJournalEntryDisplayComponent
} from './types';

export default {
    component: JournalEntryDisplayComponent,
    title: 'Journal Entry Display'
};

const Template = (args: IJournalEntryDisplayComponent) => <JournalEntryDisplayComponent {...args} />;

export const Default = Template.bind({});
