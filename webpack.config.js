const path = require('path');
require('dotenv').config();

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Minimizing bundle
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const postCssPresetEnv = require('postcss-preset-env')

const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: [
    `${__dirname}/src/index.css`
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: {
    minimize: !isDevMode,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        }
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        test: /\.js(\?.*)?$/i,
      })
    ],
  },

  resolve: {
    extensions: ['.js', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          { loader: 'css-loader', options: { importLoaders: 2 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')({
                  flexbox: true,
                }),
                require('postcss-import')({ root: loader.resourcePath }),
                require('cssnano')(),
                postCssPresetEnv({
                  features: {
                    'custom-properties': true,
                    'custom-media-queries': true
                  },
                  importFrom: path.join(__dirname, 'src/styles/helpers/customMedia.css')
                }),
              ]
            }
          },
        ]
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './src/assets',
        to: 'assets/'
      }
    ]),

    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    })
  ]
};