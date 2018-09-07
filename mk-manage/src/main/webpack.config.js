var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/react');
var pathToReactDOM = path.resolve(node_modules, 'react-dom/index')

module.exports = {
  devtool: 'eval-source-map',
  devServer: {
    /*headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
     },*/
    historyApiFallback: true,
    hot: true,
    inline: true,
    contentBase: './webapp/build',
    progress: true,
    port: 8000,
    proxy: {
     '\*': {
    	 target: 'http://120.55.40.208:8081/',
       secure: false
     }
    } 
  },
  entry: [
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/dev-server',
    path.resolve(__dirname, 'react/main.js')
  ],
  output: {
    path: __dirname + '/webapp/build',
    publicPath: '/build',
    filename: './bundle.js',
    chunkFilename: "[id].bundle.js"
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, 'react'),
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader?cacheDirectory'],
        noParse: [pathToReact, pathToReactDOM]
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader'
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
      loader: 'url'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new OpenBrowserPlugin({
      url: 'http://localhost:8000/dev/index.html'
    })
  ]
};