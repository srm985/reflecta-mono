import {
    Meta,
    StoryObj
} from '@storybook/react';

import JournalEntryDisplayComponent from './index';

import {
    IJournalEntryDisplayComponent
} from './types';

type Story = StoryObj<IJournalEntryDisplayComponent>;

const meta: Meta = {
    component: JournalEntryDisplayComponent,
    title: 'Journal Entry Display'
};

const title = 'Velit culpa laboris dolore amet non nisi id exercitation.';
const body = 'Adipisicing in veniam dolor consectetur et. Dolore ad non ut id elit incididunt mollit labore Lorem officia. Aute minim anim tempor eiusmod dolor duis mollit nulla anim veniam fugiat pariatur nostrud. Eu labore enim ea ipsum commodo exercitation aliqua ullamco. Est consequat ex sit aliqua officia ad eu laboris quis cillum fugiat ipsum. Tempor tempor veniam in do et ipsum veniam irure aliquip proident do laborum amet. Incididunt ex eu consectetur eiusmod dolor nostrud aliqua.\nQuis adipisicing laboris in excepteur occaecat. Nisi consequat ipsum cillum quis velit adipisicing irure elit pariatur pariatur. Consectetur officia laboris culpa id excepteur anim adipisicing et qui. Sint ea minim et et pariatur labore deserunt dolore qui. Exercitation eu Lorem tempor anim est. Esse nostrud eu adipisicing voluptate duis. Laboris quis ipsum aliqua aute aliquip nostrud voluptate eu dolore.';
const date = new Date();

export const HighInterest: Story = {
    render: (args: IJournalEntryDisplayComponent) => (
        <JournalEntryDisplayComponent
            {...args}
            body={body}
            isHighInterest
            location={'Madrid, España'}
            occurredAt={date.toISOString()}
            title={title}
        />
    )
};

export const LowInterest: Story = {
    render: (args: IJournalEntryDisplayComponent) => (
        <JournalEntryDisplayComponent
            {...args}
            body={body}
            occurredAt={date.toISOString()}
            title={title}
        />
    )
};

export default meta;
