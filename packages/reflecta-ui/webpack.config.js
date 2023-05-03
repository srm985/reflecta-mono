const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const path = require('path');

module.exports = () => {
    const {
        env: {
            FEDERATED_COMPONENTS_URL,
            NODE_ENV,
            WEBPACK_SERVER_PORT_UI
        }
    } = process;

    const plugins = [
        new Dotenv({
            systemvars: true
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // favicon: './src/assets/icons/favicon.ico',
            filename: 'index.html',
            path: path.join(__dirname, '../dist/'),
            template: './src/index.html'
        }),
        new webpack.container.ModuleFederationPlugin({
            remotes: {
                'reflecta-components-module-federation': FEDERATED_COMPONENTS_URL
            }
        })
    ];

    const entry = './src/index.tsx';

    return ({
        devServer: {
            historyApiFallback: true,
            hot: true,
            port: WEBPACK_SERVER_PORT_UI
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
