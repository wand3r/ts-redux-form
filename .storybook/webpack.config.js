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
      test: /\.s?css$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader", options: { plugins: [autoprefixer] } },
        { loader: "sass-loader" },
      ],
    },
  ]

  storybookConfig.devtool = "cheap-module-source-map"
  storybookConfig.resolve.extensions = [
    ...storybookConfig.resolve.extensions,
    ".ts",
    ".tsx",
    ".css",
    ".scss",
  ]

  return storybookConfig
}
