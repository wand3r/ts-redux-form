const path = require("path")
const autoprefixer = require("autoprefixer")

module.exports = function(storybookConfig, configType) {
  storybookConfig.module.rules = [
    ...storybookConfig.module.rules,
    {
      test: /\.tsx?$/,
      include: path.resolve("./"),
      use: ["ts-loader"],
    },
    {
      test: /\.scss$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader", options: { sourceMap: true } },
        {
          loader: "postcss-loader",
          options: { plugins: [autoprefixer], sourceMap: true },
        },
        { loader: "sass-loader", options: { sourceMap: true } },
      ],
    },
  ]

  storybookConfig.devtool = "cheap-module-eval-source-map"
  storybookConfig.resolve.extensions = [
    ...storybookConfig.resolve.extensions,
    ".ts",
    ".tsx",
    ".scss",
  ]

  return storybookConfig
}
