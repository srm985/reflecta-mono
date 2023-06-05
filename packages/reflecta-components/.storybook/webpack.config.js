/* eslint-disable no-param-reassign */
const path = require('path');

module.exports = async ({
    config
}) => {
    config.module.rules.push({
        test: /\.scss$/i,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resourcePath) => resourcePath.endsWith('colors.scss')
                    }
                }
            },
            'postcss-loader',
            'sass-loader'
        ]
    });

    config.resolve.alias = {
        ...config.resolve.alias,
        '@components': path.resolve(__dirname, '../src/components'),
        '@constants': path.resolve(__dirname, '../src/constants.ts'),
        '@modules': path.resolve(__dirname, '../src/modules'),
        '@styles': path.resolve(__dirname, '../src/styles'),
        '@utils': path.resolve(__dirname, '../src/utils')
    };

    return config;
};
