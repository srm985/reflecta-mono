module.exports = async ({
    config
}) => {
    config.module.rules.push({
        test: /\.scss$/i,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
        ]
    });

    return config;
};
