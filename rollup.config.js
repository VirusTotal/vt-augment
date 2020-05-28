import typescript from "rollup-plugin-typescript"
import { terser } from "rollup-plugin-terser"
import nodeResolve from "rollup-plugin-node-resolve"

export default {
    input: "./src/index.umd.ts",
    output: [
        {
            file: "dist/bundle/vt-augment.js",
            format: "umd",
            name: "vt-augment",
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
        terser({
            output: {
                comments: false
            }
        })
    ],
    external: [ "url" ]
}
