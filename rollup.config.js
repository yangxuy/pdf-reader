import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/main.ts",
    output: {
        file: "./dist/bundle.js",
        sourcemap: true,
        format: "umd",
    },
    plugins: [
        resolve(),
        babel({ babelHelpers: "bundled" }),
        typescript(),
        commonjs(),
    ],
    external: ["canvas"],
};
