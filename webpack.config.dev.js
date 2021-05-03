const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/app/main.ts',
    output: {
        filename: './js/main.js',
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js'],

        plugins: [
            new TsconfigPathsPlugin({
                /* options: see below */
            }),
        ],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
            },
            { test: /\.js$/, loader: 'source-map-loader' },
        ],
    },
    watch: true,
    plugins: [
        new CopyPlugin({
            patterns: [{ from: 'src/assets' }],
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
    ],
    devServer: {
        contentBase: './docs',
        compress: false,
        port: 12345,
    },
    mode: 'development',
    // Other options...
};
