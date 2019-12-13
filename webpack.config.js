const path = require('path');
require('dotenv').config();

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Minifying
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
      chunks: "all"
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
                postCssPresetEnv(),
                require('autoprefixer')({
                  flexbox : true,
                }),
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('cssnano')(),
              ]
            }
          },
        ]
      },

      {
				test: /\.(svg|png|jpg|woff|woff2|eot|ttf|otf)$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
				},
			},
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: './src/index.html' 
    }),

    new CleanWebpackPlugin(),
    
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
  ]
};