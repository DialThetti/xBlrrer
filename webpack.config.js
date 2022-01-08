const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: './src/app/main.ts',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: './js/main.js',
    },

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
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: 'src/assets' }],
        }),
    ],

    // Other options...
};
