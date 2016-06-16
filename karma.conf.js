var path = require('path')

var webpackConfig = {
  output: {
    path: path.resolve(__dirname, './test/unit'),
    filename: 'specs.js'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [
          path.resolve(__dirname, './node_modules')
        ]
      }
    ]
  },
  devServer: {
    contentBase: './test/unit',
    noInfo: true
  },
  devtool: '#inline-source-map'
}

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    files: [
      './test/unit/index.js'
    ],
    preprocessors: {
      './test/unit/index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    browsers: ['PhantomJS']
  })
}
