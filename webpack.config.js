const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/index.js')
    ]
  },
  // devServer: {
  //   contentBase: path.join(__dirname, "public"),
  //   compress: true,
  //   port: 3000
  // },
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/'
  },
  // watch: !isProd,
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'template.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        TIME_STAMP: Date.now(),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module, count) {
        var context = module.context;
        return context &&
          context.indexOf('node_modules') >= 0 &&
          context.indexOf('node_modules/debug') === -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),
  ].concat(isProd ? [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ] : [
    new webpack.NamedModulesPlugin(),
  ]),
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'babel-loader',
      include: [
        path.resolve(__dirname, 'src'),
      ],
    }, {
      test: /\.json$/,
      use: 'json-loader',
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.(woff2?|eot|ttf)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          prefix: 'font/',
          limit: 10000,
        },
      }],
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
        options: {
          plugins() {
            return [autoprefixer];
          },
        },
      }, {
        loader: 'css-loader',
      }, {
        loader: 'less-loader',
      }],
    }, {
      test: /\.(gif|png|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: '[hash].[ext]',
        },
      }, {
        loader: 'image-webpack-loader',
        options: {
          progressive: true,
          optipng: {
            optimizationLevel: 7,
          },
          gifsicle: {
            interlaced: false,
          },
        },
      }],
    }, {
      test: /\.jpg$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      }],
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      src: path.join(__dirname, 'src'),
    },
  },
};
