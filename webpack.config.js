const path = require("path");
const debug = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: debug ? "source-map" : false,
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 3001,
  },
};
