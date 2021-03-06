import del from "rollup-plugin-delete"
import serve from "rollup-plugin-serve"
import css from "rollup-plugin-css-only"
import svelte from "rollup-plugin-svelte"
import { terser } from "rollup-plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import livereload from "rollup-plugin-livereload"
import { optimizeCarbonImports } from "carbon-components-svelte/preprocess"

export const production = !process.env.ROLLUP_WATCH

export default {
  input: "src/index.js",
  output: {
    sourcemap: !production,
    format: "es",
    name: "app",
    dir: "public/build",
  },
  plugins: [
    // Clean the build directory before building
    production && del({ targets: "public/build/*" }),

    svelte({
      preprocess: [
        // Include stand-alone pre-processors from svelte-preprocess in below queue
        optimizeCarbonImports(),
      ],

      compilerOptions: {
        dev: !production,
        css: false,
        // accessors: true,
        format: "esm",
      },
    }),

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),

    !production && serve({ contentBase: ["public"], port: 5000 }),

    !production && livereload({ watch: "public" }),

    // If we're building for production (npm run build instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
