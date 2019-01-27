const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const autoprefixer = require("autoprefixer");

const path = require("path");
const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const devtool = devMode ? "cheap-module-eval-source-map" : "none";

let plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(mode)
    },
    DEVELOPMENT: devMode
  }),
  new HtmlWebpackPlugin({
    inject: "body",
    hash: true,
    template: "./src/index.html",
    filename: "index.html",
    favicon: "./src/app/assets/images/favicon.ico"
  })
];

let postcssLoaderPlugins = [autoprefixer];
let optimization = {};
let devServer = {
  inline: true,
  contentBase: path.join(__dirname, "public"),
  port: 3100,
  historyApiFallback: true
};

if (!devMode) {
  devServer = {};
  plugins = [
    ...plugins,
    new ExtractTextPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    }),
    new WebpackCleanupPlugin()
  ];

  const minimizer = [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    })
  ];

  const splitChunks = {
    cacheGroups: {
      // Split vendor code to its own chunk(s)
      vendors: {
        test: /[\\/]node_modules[\\/]/i,
        chunks: "all"
      },
      // Split code common to all chunks to its own chunk
      commons: {
        name: "commons", // The name of the chunk containing all common code
        chunks: "initial", // TODO: Document
        minChunks: 2 // This is the number of modules
      }
    }
  };

  optimization = {
    minimizer,
    splitChunks,
    runtimeChunk: {
      name: "runtime"
    },
    nodeEnv: "production",
    minimize: true
  };
}

const config = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
    sourceMapFilename: "[name].[hash].map.js",
    publicPath: "/"
  },
  devServer,
  mode,
  devtool,
  plugins,
  optimization,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: devMode ? "style-loader" : ExtractTextPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: devMode,
              modules: true,
              importLoaders: 2,
              localIdentName: "[local]__[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: postcssLoaderPlugins
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractTextPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: /\.(eot|otf|woff|woff2|ttf)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "url-loader",
        options: {
          limit: 50000,
          prefix: "font",
          name: "[hash].[ext]",
          outputPath: "assets/fonts/"
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /(node_modules|bower_components)/,
        loader: "url-loader",
        options: {
          limit: 1150000,
          prefix: "image",
          name: "[hash].[ext]",
          outputPath: "assets/images/"
        }
      },
      {
        test: /\.svg$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ]
  }
};

module.exports = config;

// import webpack from "webpack";
// import path from "path";
// import HtmlWebpackPlugin from "html-webpack-plugin";
// import UglifyJSPlugin from "uglifyjs-webpack-plugin";
// import MiniCssExtractPlugin from "mini-css-extract-plugin";

// const DEVELOPMENT = process.env.NODE_ENV === "development";
// const PRODUCTION = process.env.NODE_ENV === "production";

// const mode = DEVELOPMENT ? "development" : "production";

// let entry = PRODUCTION
//   ? {
//       index: path.resolve(__dirname, "src/index")
//     }
//   : [
//       "eventsource-polyfill", // necessary for hot reloading with IE
//       "webpack-hot-middleware/client?reload=true", //note that it reloads the page if hot module reloading fails.
//       path.resolve(__dirname, "src/index")
//     ];

// let devtool = PRODUCTION ? "source-map" : "cheap-module-eval-source-map";

// let output = DEVELOPMENT
//   ? {
//       path: __dirname + "/dist", // Note: Physical files are only output by the production build task `npm run build`.
//       publicPath: "/",
//       filename: "scripts.js"
//     }
//   : {
//       path: path.resolve(__dirname, "dist"),
//       publicPath: "/",
//       filename: "[name].[chunkhash].js"
//     };

// let plugins = DEVELOPMENT
//   ? [
//       new webpack.LoaderOptionsPlugin({
//         minimize: false,
//         debug: true,
//         noInfo: true // set to false to see a list of every file being bundled.
//       }),
//       new webpack.HotModuleReplacementPlugin() //for hot reloading
//     ]
//   : [
//       new webpack.HashedModuleIdsPlugin(),

//       // for compatibility with old loaders, loaders can be switched to minimize mode via plugin
//       new webpack.LoaderOptionsPlugin({
//         minimize: true,
//         debug: false,
//         noInfo: false
//       }),

//       // Extract text from bundle into a file
//       new MiniCssExtractPlugin({
//         filename: "[name].[chunkhash].css",
//         chunkFilename: "[id].css"
//       }),

//       // Simplifies creation of HTML files to serve webpack bundles
//       new HtmlWebpackPlugin({
//         template: "build/index-template.html",
//         minify: {
//           removeComments: true,
//           collapseWhitespace: true,
//           removeRedundantAttributes: true,
//           useShortDoctype: true,
//           removeEmptyAttributes: true,
//           removeStyleLinkTypeAttributes: true,
//           keepClosingSlash: true,
//           minifyJS: true,
//           minifyCSS: true,
//           minifyURLs: true
//         },
//         inject: true
//       })
//     ];

// plugins.push(
//   new webpack.DefinePlugin({
//     DEVELOPMENT: JSON.stringify(DEVELOPMENT),
//     PRODUCTION: JSON.stringify(PRODUCTION),
//     "process.env": {
//       NODE_ENV: JSON.stringify(PRODUCTION ? "production" : "development")
//     }
//   })
// );

// let cssLoaders = PRODUCTION
//   ? [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
//   : ["style-loader", "css-loader", "sass-loader"];

// export default {
//   resolve: {
//     extensions: ["*", ".js", ".jsx", ".json"],
//     modules: [path.resolve(__dirname, "./src"), "node_modules"]
//   },
//   mode: mode,
//   context: __dirname,
//   devtool: devtool,
//   entry: entry,
//   target: "web",
//   output: output,
//   plugins: plugins,
//   optimization: {
//     splitChunks: {
//       // replaces CommonsChunkPlugin()
//       name: "vendor",
//       minChunks: Infinity
//     },
//     noEmitOnErrors: true, // NoEmitOnErrorsPlugin
//     // concatenateModules: true, //ModuleConcatenationPlugin
//     minimizer: [
//       // Minify JS and allow tree shaking
//       new UglifyJSPlugin({
//         uglifyOptions: {
//           output: {
//             comments: false
//           },
//           compress: true
//         }
//       })
//     ]
//   },
//   module: {
//     rules: [
//       {
//         test: /\.s?css$/,
//         use: cssLoaders,
//         exclude: "/node_modules/"
//       },
//       {
//         test: /\.jsx?$/, // loads both js and jsx files
//         exclude: /node_modules/,
//         loader: "babel-loader"
//       },
//       {
//         test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
//         use: "file-loader"
//       },
//       {
//         test: /\.(woff|woff2)$/,
//         use: "url-loader?prefix=font/&limit=5000&name=[name]-[hash].[ext]"
//       },
//       {
//         test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//         use: "url-loader?limit=10000&mimetype=application/octet-stream"
//       },
//       {
//         test: /\.(jpe?g|png|gif|svg)$/i,
//         use: [
//           "file-loader?hash=sha512&digest=hex&name=[name]-[hash].[ext]",
//           {
//             loader: "image-webpack-loader",
//             options: {
//               mozjpeg: {
//                 progressive: true
//               },
//               gifsicle: {
//                 interlaced: false
//               },
//               optipng: {
//                 optimizationLevel: 4
//               },
//               pngquant: {
//                 quality: "75-90",
//                 speed: 3
//               }
//             }
//           }
//         ]
//       }
//     ]
//   }
// };
