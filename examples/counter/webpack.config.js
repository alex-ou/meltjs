var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist/bundle.js')
  },
  externals: {
    'entities': true,
    'de-indent': true,
    'source-map': true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
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
