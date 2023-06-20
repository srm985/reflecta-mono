import {
    Meta,
    StoryObj
} from '@storybook/react';

import GridContainerComponent from '@components/GridContainerComponent';
import GridItemComponent from '@components/GridItemComponent';

import CardComponent from './index';

import {
    ICardComponent
} from './types';

type Story = StoryObj<ICardComponent>;

const meta: Meta<ICardComponent> = {
    component: CardComponent,
    title: 'Card'
};

const CardContent = () => {
    const content = 'Enim cillum laborum officia esse. Deserunt ex amet reprehenderit adipisicing commodo incididunt commodo dolore veniam sunt dolor sint. Esse in occaecat occaecat esse ea qui. Cupidatat commodo enim ex deserunt ea magna ipsum do sit culpa.';

    const length = Math.ceil(Math.random() * content.length);

    const curatedContent = `${content.slice(0, length).trim().replace(/\.$/, '')}...`;

    return (
        <>
            <h1 className={'mb--2'}>{'Occaecat deserunt dolor deserunt fugiat cupidatat.'}</h1>
            <p>{curatedContent}</p>
        </>
    );
};

export const Default: Story = {
    args: {
        children: <CardContent />
    },
    render: (args) => (
        <GridContainerComponent>
            <GridItemComponent
                breakpointLarge={{
                    span: 4
                }}
                breakpointMedium={{
                    span: 6
                }}
                breakpointXlarge={{
                    span: 3
                }}
            >
                <CardComponent {...args}>
                    <CardContent />
                </CardComponent>
            </GridItemComponent>
            <GridItemComponent
                breakpointLarge={{
                    span: 4
                }}
                breakpointMedium={{
                    span: 6
                }}
                breakpointXlarge={{
                    span: 3
                }}
            >
                <CardComponent {...args} />
            </GridItemComponent>
            <GridItemComponent
                breakpointLarge={{
                    span: 4
                }}
                breakpointMedium={{
                    span: 6
                }}
                breakpointXlarge={{
                    span: 3
                }}
            >
                <CardComponent {...args} />
            </GridItemComponent>
            <GridItemComponent
                breakpointLarge={{
                    span: 4
                }}
                breakpointMedium={{
                    span: 6
                }}
                breakpointXlarge={{
                    span: 3
                }}
            >
                <CardComponent {...args} />
            </GridItemComponent>
            <GridItemComponent
                breakpointLarge={{
                    span: 4
                }}
                breakpointMedium={{
                    span: 6
                }}
                breakpointXlarge={{
                    span: 3
                }}
            >
                <CardComponent {...args} />
            </GridItemComponent>
        </GridContainerComponent>
    )
};

export default meta;
