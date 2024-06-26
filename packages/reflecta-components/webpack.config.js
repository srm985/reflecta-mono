const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const fs = require('fs/promises');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = async () => {
    const {
        env: {
            NODE_ENV,
            WEBPACK_SERVER_PORT_COMPONENTS
        }
    } = process;

    console.log({
        WEBPACK_SERVER_PORT_COMPONENTS
    });

    const COMPONENT_ROOT = './src/components';
    const DECLARATIONS_DIRECTORY = './declarations';

    const results = await fs.readdir(COMPONENT_ROOT, {
        withFileTypes: true
    });

    const directoriesList = results.filter((result) => result.isDirectory() && result.name !== '_internal').map((result) => result.name);

    console.log('Found the following components to export:');
    console.log(directoriesList.join('\n'));

    const componentsList = directoriesList.map((directoryName) => ({
        [`./${directoryName}`]: `${COMPONENT_ROOT}/${directoryName}`
    }));

    const declarationsList = directoriesList.map((componentName) => `declare module 'reflecta-components-module-federation/${componentName}';`);

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
            exposes: componentsList,
            filename: 'remoteEntry.js',
            name: 'reflecta_components',
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
                // I found some lingering artifacts so we empty the directory before each build
                compiler.hooks.beforeRun.tapAsync('GenerateModuleDeclarationPlugin', async (_, callback) => {
                    try {
                        await fs.rm(DECLARATIONS_DIRECTORY, {
                            force: true,
                            recursive: true
                        });
                    } catch (error) { }

                    await fs.mkdir(DECLARATIONS_DIRECTORY);

                    callback();
                });
            }
        },
        {
            apply: (compiler) => {
                // This generates the declarations module used for importing components into UI
                compiler.hooks.afterCompile.tapAsync('GenerateModuleDeclarationPlugin', async (_, callback) => {
                    await fs.writeFile(`${DECLARATIONS_DIRECTORY}/index.d.ts`, declarationsList.join('\n'));

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
            port: WEBPACK_SERVER_PORT_COMPONENTS
        },
        entry,
        mode: NODE_ENV,
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                    test: /\.tsx?$/i
                },
                {
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    auto: /^.*(colors|units).scss$/,
                                    mode: 'icss'
                                }
                            }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        output: {
            clean: true,
            filename: 'bundle.[fullhash].js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins,
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@constants': path.resolve(__dirname, 'src/constants.ts'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@utils': path.resolve(__dirname, 'src/utils')
            },
            extensions: [
                '.tsx',
                '.ts',
                '.js'
            ]
        }
    });
};
