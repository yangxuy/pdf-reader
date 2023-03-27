const webpack = require("webpack"); // eslint-disable-line no-unused-vars
const path = require("path");

module.exports = {
    entry: {
        main: "./src/main.ts",
        "pdf.worker": "pdfjs-dist/build/pdf.worker.entry",
    },
    mode: "production",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: "ts-loader",
            },
        ],
    },
};
