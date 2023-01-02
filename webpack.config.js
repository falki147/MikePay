const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = (env, argv) => {
  const demoPlugins = [];
  if (env.demo) {
    demoPlugins.push(new NormalModuleReplacementPlugin(/[\/\\]config.js/, 'config.demo.js'));
  }

  return {
    plugins: [
      new MiniCssExtractPlugin(),
      ...demoPlugins
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
  }
};
