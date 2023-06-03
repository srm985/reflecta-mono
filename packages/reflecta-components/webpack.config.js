const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
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

    const COMPONENT_ROOT = './src/components';

    const results = await fs.readdir(COMPONENT_ROOT, {
        withFileTypes: true
    });

    const directoriesList = results.filter((result) => result.isDirectory()).map((result) => result.name);

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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // favicon: './src/assets/icons/favicon.ico',
            filename: 'index.html',
            path: path.join(__dirname, '../dist/'),
            template: './src/index.html'
        }),
        new webpack.container.ModuleFederationPlugin({
            exposes: componentsList,
            filename: 'remoteEntry.js',
            name: 'reflecta_components'
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('GenerateModuleDeclarationPlugin', async () => {
                    const declarationsDirectory = './declarations';

                    try {
                        await fs.mkdir(declarationsDirectory);
                    } catch (error) {}

                    await fs.writeFile(`${declarationsDirectory}/index.d.ts`, declarationsList.join('\n'));
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
                                modules: {
                                    auto: (resourcePath) => resourcePath.endsWith('colors.scss')
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
