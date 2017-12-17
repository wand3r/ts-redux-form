import { resolve as resolvePath } from "path"
import * as webpack from "webpack"
import * as HtmlWebpackPlugion from "html-webpack-plugin"
import * as autoprefixer from "autoprefixer"
import * as ExtractTextPlugin from "extract-text-webpack-plugin"
import { getEnvironment } from "./globalVariables"

type Config = webpack.Configuration

const environment = getEnvironment()

console.log(`Running webpack in ${environment} mode`)

const entry: Config["entry"] = {
  app: ["react-hot-loader/patch", resolvePath(__dirname, "src", "index.tsx")],
}

const output: Config["output"] = {
  filename: "[name].js",
  path: resolvePath(__dirname, "build"),
  publicPath: "/",
}

const resolve: Config["resolve"] = {
  modules: ["node_modules", resolvePath(__dirname, "src")],
  extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
}

const modules: Config["module"] = {
  rules: [
    {
      test: /\.tsx?$/,
      use: [{ loader: "react-hot-loader/webpack" }, { loader: "ts-loader" }],
      include: resolvePath(__dirname, "src"),
    },
    {
      test: /\.s?css$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader", options: { plugins: [autoprefixer] } },
        { loader: "sass-loader" },
      ],
    },
  ],
}

const plugins: Config["plugins"] = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(environment),
    },
  }),
  ...(environment === "development"
    ? [
        new HtmlWebpackPlugion({
          template: resolvePath("src", "index.html"),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      ]
    : []),
  ...(environment === "production"
    ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: true,
          },
        }),
        new ExtractTextPlugin({
          filename: "[name].[contenthash].css",
        }),
      ]
    : []),
]

const devtool: Config["devtool"] = "cheap-module-source-map"

const devServer: Config["devServer"] = {
  host: "localhost",
  port: 3000,
  hot: true,
  inline: true,
  overlay: {
    warnings: true,
    errors: true,
  },
  contentBase: resolvePath(__dirname, "static"),
  publicPath: "/",
}

const config: Config = {
  entry,
  output,
  resolve,
  module: modules,
  devtool,
  plugins,
  devServer,
}

export default config
