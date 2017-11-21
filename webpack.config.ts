import { resolve } from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugion from "html-webpack-plugin";

type Environment = "development" | "production";

function isEnvironment(arg: any): arg is Environment {
  return arg == "development" || arg == "production";
}

const environment = process.env.NODE_ENV;

if (!isEnvironment(environment))
  throw new Error("Invalid environment variable");

console.log(`Running webpack in ${environment} mode`);

let plugins: webpack.Plugin[] = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(environment),
    },
  }),
];

if (environment === "development") {
  plugins = [
    ...plugins,
    new HtmlWebpackPlugion({
      template: resolve("src", "index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ];
}

if (environment === "production") {
  plugins = [
    ...plugins,
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true,
      },
    }),
  ];
}

const config: webpack.Configuration = {
  entry: {
    app: ["react-hot-loader/patch", resolve(__dirname, "src", "index.tsx")],
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "build"),
    publicPath: "",
  },
  devtool: "cheap-module-source-map",
  resolve: {
    modules: ["node_modules", resolve(__dirname, "src")],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "react-hot-loader/webpack" }, { loader: "ts-loader" }],
        include: resolve(__dirname, "src"),
      },
    ],
  },
  plugins,
  devServer: {
    host: "localhost",
    port: 3000,
    hot: true,
    inline: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    contentBase: resolve(__dirname, "static"),
  },
};

module.exports = config;
