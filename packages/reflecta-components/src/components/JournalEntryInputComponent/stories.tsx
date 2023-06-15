import JournalEntryInputComponent from './index';

import {
    IJournalEntryInputComponent
} from './types';

export default {
    component: JournalEntryInputComponent,
    title: 'JournalEntryInputComponent'
};

const Template = (args: IJournalEntryInputComponent) => <JournalEntryInputComponent {...args} />;

export const Default = Template.bind({});
