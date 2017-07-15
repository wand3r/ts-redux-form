var path = require("path");

module.exports = function(storybookConfig, configType) {
  storybookConfig.module.rules = [
    ...storybookConfig.module.rules,
    {
      test: /\.tsx?$/,
      include: path.resolve("./"),
      use: ["ts-loader"],
    },
  ];

  storybookConfig.devtool = "cheap-module-source-map";
  storybookConfig.resolve.extensions = [
    ...storybookConfig.resolve.extensions,
    ".ts",
    ".tsx",
  ];

  return storybookConfig;
};
