const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const fs = require('fs/promises');
const path = require('path');

module.exports = async () => {
    const {
        env: {
            BASE_URL,
            LOCAL_STORAGE_TOKEN,
            NODE_ENV
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
            exposes: componentsList,
            filename: 'remoteEntry.js',
            name: 'reflecta_components'
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('GenerateModuleDeclarationPlugin', async () => {
                    await fs.writeFile('./declarations/index.d.ts', declarationsList.join('\n'));
                });
            }
        }
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
                    loader: 'ts-loader',
                    test: /\.tsx?$/i
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
