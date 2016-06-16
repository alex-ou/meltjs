var path = require('path')

module.exports = {
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'opal.js'
  },
  externals: {
    'entities': true,
    'de-indent': true,
    'source-map': true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname)
      }
    ]
  }
}
