const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // TODO: Disable for prod
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin()
  ],
  entry: [
    './src/js/index.js',
    './src/css/index.css'
  ],
  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      }
    ]
  }
};
