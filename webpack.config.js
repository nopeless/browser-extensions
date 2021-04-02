const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const glob = require("glob");
module.exports = {
    entry: {
        tosdr: './src/index.ts',
        stylesheet: glob.sync("./src/assets/css/*.css"),
        scripts: glob.sync("./src/assets/js/*.js"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].min.css'
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'production/assets'),
    },
};