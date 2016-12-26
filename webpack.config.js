module.exports={
  target: 'electron',
  entry:'./renderer.js',
  output:{
    filename:'./renderer-bundle.js'
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
