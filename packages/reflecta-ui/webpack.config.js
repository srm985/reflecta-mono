const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const fs = require('fs/promises');
const path = require('path');

require('dotenv').config();

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
                // This only gets called on build so you need to rebuild any time there are new components
                compiler.hooks.beforeRun.tapAsync('GenerateRemoteComponentDefinitions', async (_, callback) => {
                    const DECLARED_COMPONENTS_ROOT_DIRECTORY = '../reflecta-components/declarations/src/components';

                    const results = await fs.readdir(DECLARED_COMPONENTS_ROOT_DIRECTORY, {
                        withFileTypes: true
                    });

                    const DECLARATIONS_ROOT_DIRECTORY = './src/components/remotes';

                    try {
                        console.log(`Attempting to drop ${DECLARATIONS_ROOT_DIRECTORY}...`);

                        await fs.rm(DECLARATIONS_ROOT_DIRECTORY, {
                            force: true,
                            recursive: true
                        });
                    } catch (error) { }

                    console.log(`Generating ${DECLARATIONS_ROOT_DIRECTORY}...`);

                    await fs.mkdir(DECLARATIONS_ROOT_DIRECTORY, {
                        recursive: true
                    });

                    const componentCreationPromiseList = results.filter((result) => result.isDirectory() && result.name !== '_internal').map(async (result) => {
                        const {
                            name: componentName
                        } = result;

                        console.log(`Linking component: ${componentName}...`);

                        const componentDeclaration = `import React from 'react';\nimport {\n    I${componentName}\n} from 'reflecta-components/declarations/src/components/${componentName}/types';\n\nexport default React.memo(React.lazy(() => import('${COMPONENT_REMOTE_NAME}/${componentName}'))) as React.FC<I${componentName}>;\n`;

                        const componentDirectory = `${DECLARATIONS_ROOT_DIRECTORY}/${componentName}`;

                        await fs.mkdir(componentDirectory, {
                            recursive: true
                        });

                        await fs.writeFile(`${componentDirectory}/index.tsx`, componentDeclaration);
                    });

                    await Promise.all(componentCreationPromiseList);

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
            path: path.resolve(__dirname, 'dist')
        },
        plugins,
        resolve: {
            alias: {
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@constants': path.resolve(__dirname, 'src/constants.ts'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@routes': path.resolve(__dirname, 'src/routes.ts'),
                '@services': path.resolve(__dirname, 'src/services'),
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
