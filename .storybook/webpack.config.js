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
      test: /\.css$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader", options: { plugins: [autoprefixer] } },
      ],
    },
  ]

  storybookConfig.devtool = "cheap-module-source-map"
  storybookConfig.resolve.extensions = [
    ...storybookConfig.resolve.extensions,
    ".ts",
    ".tsx",
    ".css",
  ]

  return storybookConfig
}
