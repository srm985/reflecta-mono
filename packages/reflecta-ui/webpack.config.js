const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const path = require('path');

module.exports = () => {
    const {
        env: {
            BASE_URL,
            LOCAL_STORAGE_TOKEN,
            NODE_ENV
        }
    } = process;

    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // favicon: './src/assets/icons/favicon.ico',
            filename: 'index.html',
            path: path.join(__dirname, '../dist/'),
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.BASE_URL': JSON.stringify(BASE_URL),
            'process.env.LOCAL_STORAGE_TOKEN': JSON.stringify(LOCAL_STORAGE_TOKEN)
        }),
        new webpack.container.ModuleFederationPlugin({
            remotes: {
                'reflecta-components-module-federation': 'reflecta_components@http://localhost:3003/remoteEntry.js'
            }
        })
    ];

    const entry = './src/index.tsx';

    return ({
        devServer: {
            historyApiFallback: true,
            hot: true
        },
        entry,
        mode: NODE_ENV,
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    test: /\.tsx?$/i,
                    use: 'ts-loader'
                },
                {
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        output: {
            filename: 'bundle.[fullhash].js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins,
        resolve: {
            extensions: [
                '.tsx',
                '.ts',
                '.js'
            ]
        }
    });
};
