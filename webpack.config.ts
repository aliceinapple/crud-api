import path from "path";
import { Configuration } from "webpack";

const isProduction = process.env.NODE_ENV === "production";

const config: Configuration = {
  mode: isProduction ? "production" : "development",
  target: "node",
  entry: "./src/server.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  node: {
    __dirname: false,
  },
};

export default config;
