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

    return config;
};
