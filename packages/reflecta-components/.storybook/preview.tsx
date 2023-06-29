import type {
    Preview
} from '@storybook/react';
import {
    FC
} from 'react';

import RootStylingComponent from '@components/RootStylingComponent';

import StorybookStylerComponent from '@components/_internal/StorybookStylerComponent';

const withGlobalStyling = (Story: FC) => (
    <>
        <RootStylingComponent />
        <StorybookStylerComponent>
            <Story />
        </StorybookStylerComponent>
    </>
);

const preview: Preview = {
    decorators: [
        withGlobalStyling
    ],
    parameters: {
        actions: {
            argTypesRegex: '^on[A-Z].*'
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        }
    }
};

export default preview;
