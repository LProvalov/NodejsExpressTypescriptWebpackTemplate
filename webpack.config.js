var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './client/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "bin/public")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'client/index.html'
        })
    ]
};