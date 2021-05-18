const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'aspera-on-cloud-sdk.js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
};
