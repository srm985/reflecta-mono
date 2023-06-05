import type {
    StorybookConfig
} from '@storybook/react-webpack5';

const config: StorybookConfig = {
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions'
    ],
    core: {
        disableTelemetry: true,
        enableCrashReports: false
    },
    docs: {
        autodocs: 'tag'
    },
    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    },
    stories: [
        '../src/components/**/stories.tsx'
    ]
};
export default config;
