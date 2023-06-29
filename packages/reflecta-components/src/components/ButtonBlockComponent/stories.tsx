import ButtonComponent from '@components/ButtonComponent';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import ButtonBlockComponent from './index';

import {
    IButtonBlockComponent
} from './types';

export default {
    component: ButtonBlockComponent,
    title: 'Button Block'
};

const Template = (args: IButtonBlockComponent) => (
    <>
        <StorybookExampleComponent label={'Primary + Inline'}>
            <ButtonBlockComponent {...args}>
                <ButtonComponent
                    color={'danger'}
                    styleType={'inline'}
                >{'Delete'}
                </ButtonComponent>
                <ButtonComponent
                    color={'accent'}
                    styleType={'primary'}
                >{'Approve'}
                </ButtonComponent>
            </ButtonBlockComponent>
        </StorybookExampleComponent>
        <StorybookExampleComponent label={'Primary + Secondary'}>
            <ButtonBlockComponent {...args}>
                <ButtonComponent
                    color={'neutral'}
                    styleType={'secondary'}
                >{'Save for later'}
                </ButtonComponent>
                <ButtonComponent
                    color={'primary'}
                    styleType={'primary'}
                >{'Approve'}
                </ButtonComponent>
            </ButtonBlockComponent>
        </StorybookExampleComponent>
    </>
);

export const Default = Template.bind({});
