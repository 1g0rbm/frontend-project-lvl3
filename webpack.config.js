import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CssMinimierWebpackPlugin from 'css-minimizer-webpack-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
  context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV || 'development',
  entry: './index.js',
  output: {
    filename: fielename('js'),
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
  },
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
      ];
    }

    return plugins;
  })(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
