const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./app/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: 'app/dist',
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              // modules: true,
              // importLoaders: 2,
              // localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true
              // minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlPlugin]
};