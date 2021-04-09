const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode:'production',
    
    entry: './src/app/main.ts',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: './js/main.js',
    },

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'awesome-typescript-loader',
            },
            { test: /\.js$/, loader: 'source-map-loader' },
        ],
    },
    plugins: [new CopyPlugin({
        patterns: [
            { from: 'src/assets' }
        ]
        })],

    // Other options...
};
