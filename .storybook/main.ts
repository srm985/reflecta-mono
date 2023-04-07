import type {
    StorybookConfig
} from '@storybook/react-webpack5';

const storybookConfig: StorybookConfig = {
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions'
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    },
    stories: [
        '../src/components/ButtonComponent/stories.tsx'
    ],
    webpackFinal: async (config) => {
        config?.module?.rules?.push({
            test: /\.scss$/i,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        });

        return config;
    }
};

export default storybookConfig;
