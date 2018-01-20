import { resolve as resolvePath } from "path"
import * as webpack from "webpack"
import * as HtmlWebpackPlugion from "html-webpack-plugin"
import * as autoprefixer from "autoprefixer"
import * as ExtractTextPlugin from "extract-text-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import { parseEnvironment } from "./globalVariables"

type Config = webpack.Configuration

export default (env: { environment: any; analyze: any }) => {
  const environment = parseEnvironment(env.environment)
  const analyze = Boolean(env.analyze)

  console.log(`Running webpack in ${environment} mode`)

  const entry: Config["entry"] = {
    app: [
      "react-hot-loader/patch",
      resolvePath(__dirname, "examples", "index.tsx"),
    ],
  }

  const output: Config["output"] = {
    filename: "[name].js",
    path: resolvePath(__dirname, "build"),
    publicPath: "/",
  }

  const resolve: Config["resolve"] = {
    modules: ["node_modules"],
    alias: {
      "ts-redux-form": resolvePath(__dirname, "src"),
    },
    extensions: [".ts", ".tsx", ".js", ".scss"],
  }

  const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: environment === "development",
  })

  const modules: Config["module"] = {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "react-hot-loader/webpack" }, { loader: "ts-loader" }],
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            { loader: "css-loader", options: { sourceMap: true } },
            {
              loader: "postcss-loader",
              options: { plugins: [autoprefixer], sourceMap: true },
            },
            { loader: "sass-loader", options: { sourceMap: true } },
          ],
          fallback: "style-loader",
        }),
      },
    ],
  }

  const plugins: Config["plugins"] = [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(environment),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractSass,
    ...(environment === "development"
      ? [
          new HtmlWebpackPlugion({
            template: resolvePath("examples", "index.html"),
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
        ]
      : []),
    ...(analyze ? [new BundleAnalyzerPlugin()] : []),
  ]

  const devtool: Config["devtool"] =
    environment === "development"
      ? "cheap-module-eval-source-map"
      : "nosources-source-map"

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
    stats: "verbose",
  }

  return config
}
