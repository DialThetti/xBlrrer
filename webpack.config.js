const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/app/main.ts',
    output: {
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
    plugins: [new CopyPlugin([{ from: 'src/assets' }])],

    // Other options...
};
