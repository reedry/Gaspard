const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const HTMLInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackCdnPlugin = require("webpack-cdn-plugin");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components")
  .default;
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  context: path.join(__dirname, "src/client"),
  entry: "./index.tsx",
  mode: "development",
  output: {
    filename: "bundle.inline-js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer]
          })
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    new HTMLPlugin({
      template: "index.html",
      inlineSource: ".inline-js$"
    }),
    new HTMLInlineSourcePlugin(),
    new CopyPlugin([
      {
        from: "*",
        context: path.join(__dirname, "src/server")
      },
      {
        from: "appsscript.json",
        context: __dirname
      }
    ]),
    new WebpackCdnPlugin({
      modules: [
        {
          name: "react",
          var: "React",
          path: "umd/react.production.min.js"
        },
        {
          name: "react-dom",
          var: "ReactDOM",
          path: "umd/react-dom.production.min.js"
        }
      ]
    })
  ]
};
