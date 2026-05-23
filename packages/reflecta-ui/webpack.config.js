const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const path = require('path');

const generateRemoteComponents = require('./scripts/generateRemoteComponents');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = () => {
    const {
        env: {
            FEDERATED_COMPONENTS_URL,
            NODE_ENV,
            WEBPACK_SERVER_PORT_UI
        }
    } = process;

    const COMPONENT_REMOTE_NAME = 'reflecta-components-module-federation';

    const plugins = [
        new Dotenv({
            systemvars: true
        }),
        new HtmlWebpackPlugin({
            // favicon: './src/assets/icons/favicon.ico',
            filename: 'index.html',
            path: path.join(__dirname, '../dist/'),
            template: './src/index.html'
        }),
        new webpack.container.ModuleFederationPlugin({
            remotes: {
                [COMPONENT_REMOTE_NAME]: FEDERATED_COMPONENTS_URL
            },
            shared: {
                react: {
                    singleton: true
                },
                'react-dom': {
                    singleton: true
                }
            }
        }),
        {
            apply: (compiler) => {
                compiler.hooks.beforeRun.tapAsync('GenerateRemoteComponentDefinitions', async (_, callback) => {
                    await generateRemoteComponents();

                    callback();
                });
            }
        }
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
            clean: true,
            filename: 'bundle.[fullhash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        plugins,
        resolve: {
            alias: {
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@constants': path.resolve(__dirname, 'src/constants.ts'),
                '@hooks': path.resolve(__dirname, 'src/hooks.ts'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@routes': path.resolve(__dirname, 'src/routes.ts'),
                '@services': path.resolve(__dirname, 'src/services'),
                '@store': path.resolve(__dirname, 'src/store'),
                '@types': path.resolve(__dirname, 'src/types.ts'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@views': path.resolve(__dirname, 'src/views')
            },
            extensions: [
                '.tsx',
                '.ts',
                '.js'
            ]
        },
        watchOptions: {
            ignored: [
                path.resolve(__dirname, 'src/components/remotes/')
            ]
        }
    });
};
