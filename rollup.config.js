import typescript from "rollup-plugin-typescript"
import { terser } from "rollup-plugin-terser"
import nodeResolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "./src/index.umd.ts",
    output: [
        {
            file: "dist/bundle/vt-augment.js",
            format: "umd",
            name: "vtaugment",
            exports: "default",
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
            typescript: require("typescript"),
            importHelpers: true
        }),
        nodeResolve(),
        commonjs(),
        terser({
            output: {
                comments: false,
            },
            compress: {
                drop_console: false,
            },
        })
    ],
    external: [ "url" ]
}
