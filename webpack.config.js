module.exports={
  target: 'electron',
  entry:{
    'renderer-bundle':'./renderer.js',
    'show-bundle':'./show.js',
    'pref-bundle': './pref.js'
  },
  output:{
    filename:"[name].js"
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
        query:{
          presets:['react','es2015']
        }
      }
    ]
  }
}
