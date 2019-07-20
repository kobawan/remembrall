const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    entry: [
        path.join(__dirname, "src", "index.tsx"),
        path.join(__dirname, "src", "index.html"),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    // apollo-link-retry and service workers break on enabled splitchunks
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devtool: devMode ? "inline-source-map" : "source-map",
    resolve: {
        extensions: [".mjs", ".ts", ".tsx", ".jsx", ".js", ".json", ".less"]
	},
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader?name=[name].[ext]",
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader?name=[name].[ext]",
            },
            {
                test: /\.less$/,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
				exclude: path.join(__dirname, "node_modules"),
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /index\.html/,
                use: "html-loader",
			},
		],
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: path.join(__dirname, "src", "assets", "remembrall.png"),
            template: path.join(__dirname, "src", "index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new BundleAnalyzerPlugin()
    ],
};
