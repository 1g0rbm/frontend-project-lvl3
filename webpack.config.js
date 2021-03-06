import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CssMinimierWebpackPlugin from 'css-minimizer-webpack-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import webpack from 'webpack';

const filenamePath = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filenamePath);
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new CssMinimierWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const fielename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './index.js',
  output: {
    filename: fielename('js'),
    path: path.resolve(dirnamePath, 'public'),
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : false,
  plugins: (() => {
    const plugins = [
      new HTMLWebpackPlugin({
        template: './index.html',
        minify: {
          collapseWhitespace: isProd,
        },
      }),
      new MiniCssExtractPlugin({ filename: fielename('css') }),
      new CleanWebpackPlugin(),
    ];

    if (isDev) {
      return [
        ...plugins,
        new webpack.HotModuleReplacementPlugin(),
        new StylelintWebpackPlugin(),
      ];
    }

    return plugins;
  })(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'eslint-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        }, 'eslint-loader'],
      },
    ],
  },
};
