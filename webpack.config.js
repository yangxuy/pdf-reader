const path = require("path");

module.exports = {
    entry: {
        main: "./src/main.ts",
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
