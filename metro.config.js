const path = require("path");

module.exports = {
  resolver: {
    sourceExts: ["js", "jsx", "ts", "tsx", "json", "svg"],
  },
  watchFolders: [
    path.resolve(__dirname, "components"), // You can still include node_modules
  ],
};
