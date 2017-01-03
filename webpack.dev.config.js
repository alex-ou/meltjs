var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    'counter': ['./examples/counter/index.js'],
    'todos': ['./examples/todos/index.js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: '[name].js'
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
