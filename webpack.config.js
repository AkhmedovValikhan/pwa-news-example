const fs = require("fs");
const webpack = require("webpack");
const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const PATH = {
    appHtml: path.resolve("./public/index.html"),
};

const defines = new webpack.DefinePlugin({
    PRERENDER: JSON.stringify(!1),
});

module.exports = function(env) {
    const isEnvProduction = env && env.production;
    const isEnvDevelopment = !isEnvProduction;

    return {
        mode: isEnvProduction ? "production" : "development",
        entry: {
            main: "./src/index.tsx",
        },
        optimization: {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin()],
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: "styles",
                        test: /\.css$/,
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
            usedExports: true,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        isEnvDevelopment ? { loader: "style-loader" } : { loader: MiniCssExtractPlugin.loader },
                        { loader: "css-loader" },
                        { loader: "sass-loader" },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        "file-loader",
                    ],
                },
            ],
        },
        devServer: {
            contentBase: "./dist",
            historyApiFallback: true,
            hot: true,
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        plugins: [
            !isEnvProduction && defines,
            new CleanWebpackPlugin(),
            isEnvProduction ? new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "styles.css",
            }) : undefined,
            ...htmlPlugins(isEnvProduction),
            // new BundleAnalyzerPlugin(),
            new ServiceWorkerWebpackPlugin({
                entry: path.join(__dirname, "src/service-worker.js"),
            }),
            new CopyPlugin([
                { from: "./public", to: "./", toType: "dir" },
            ]),
        ].filter(Boolean),
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            // publicPath: '/dist',
        },
        stats: isEnvProduction ? "verbose" : "normal",
    };
};

const htmlPlugins = (isEnvProduction) => {
    return [new HtmlWebpackPlugin(
        Object.assign(
            {},
            {
                inject: true,
                template: isEnvProduction ? "!!prerender-loader?string!./src/index.html" : "./src/index.html",
            },
            isEnvProduction
                ? {
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    },
                }
                : undefined,
        ),
    ),
    (isEnvProduction && new HTMLInlineCSSWebpackPlugin()),
    ].filter(Boolean);
};
