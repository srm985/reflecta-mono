import {
    useState
} from 'react';

import ButtonComponent from '@components/ButtonComponent';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import PromptComponent from './index';

import {
    IPromptComponent
} from './types';

export default {
    component: PromptComponent,
    title: 'Prompt'
};

const Template = (args: IPromptComponent) => {
    const [
        isOpen,
        setOpen
    ] = useState<boolean>(false);

    const toggleOpen = () => {
        setOpen(!isOpen);
    };

    return (
        <StorybookExampleComponent>
            {
                isOpen && (
                    <PromptComponent
                        {...args}
                        label={'Delete entry?'}
                        message={'Are you sure you want to delete this item?'}
                        promptPrimary={{
                            color: 'danger',
                            label: 'Delete',
                            onClick: toggleOpen
                        }}
                        promptSecondary={{
                            label: 'No, don\'t delete',
                            onClick: toggleOpen
                        }}
                    />
                )
            }

            <ButtonComponent onClick={toggleOpen}>{'Toggle Prompt'}</ButtonComponent>
        </StorybookExampleComponent>
    );
};

export const Default = Template.bind({});
