'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pkg = require('../package.json');

function makeWebpackConfig(options) {
  let entry, plugins, devtool;

  console.log('Running Webpack in ' + (options.prod ? 'prod' : 'dev') + ' mode');

  if (options.prod) {
    entry = {
      app: path.resolve(__dirname, '../app/index.js'),
      vendor: Object.keys(pkg.dependencies)
    };

    plugins = [
      new CleanWebpackPlugin({
        output: path.resolve(__dirname, '../', 'prod'),
      }),
      new HtmlWebpackPlugin({
        template: './app/index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  } else {
    devtool = 'source-map';

    entry = [
      'webpack-dev-server/client?http://localhost:5000',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, '../app/index.js')
    ];

    plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './app/index.html',
        favicon: './app/styles/images/favicon.ico'
      })
    ]
  }

  return {
    devtool: devtool,
    entry: entry,
    output: {
      path: path.resolve(__dirname, '../', 'prod', 'client'),
      filename: '[name].[fullhash:8].js',
      sourceMapFilename: '[name].[fullhash:8].map',
      chunkFilename: '[id].[fullhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.json$/,
          use: ['json-loader']
        },  {
          test: /\.(png|jpg|gif)$/,
          use: ['url-loader?limit=200000&context=./assets']
        }, {
          test: /\.(ttf|ico)$/,
          use: ['file?name=[name].[ext]']
        },
        {
          test: /\.css$/, 
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    ["postcss-import",
                      {
                        onImport: function (files) {
                          files.forEach(this.addDependency)
                        }.bind(this)
                      }
                    ],
                    'postcss-simple-vars',
                    'postcss-focus',
                    ['autoprefixer',
                      {
                        browsers: ['last 2 versions', 'IE > 8']
                      }
                    ],
                    [
                      'postcss-reporter',
                      {
                        clearMessages: true
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      ]
    },
    plugins: plugins,
    optimization: {
      splitChunks: {
        chunks: "all",
      }
    },
    target: 'web',
    stats: !options.prod,
  }
}

module.exports = makeWebpackConfig;
