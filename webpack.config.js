var webpack = require('webpack');
module.exports = {
    target: 'electron',
    entry: {
        'renderer-bundle': './app/renderer.js',
        'show-bundle': './app/show.js',
        'saleSetting-bundle': './app/saleSetting.js'
    },
    output: {
        filename: "./app/compiled/[name].js"
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']
            }
        ]
    }
}
