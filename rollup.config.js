const path = require('path');

import typescript from "rollup-plugin-typescript"
import { terser } from "rollup-plugin-terser"
import nodeResolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs";
import license from "rollup-plugin-license";

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
        }),
        license({
            banner: {
                commentStyle: 'regular', // The default
                content: {
                file: path.join(__dirname, 'LICENSE'),
                },
            },
        })
    ],
}
