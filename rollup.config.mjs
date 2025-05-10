import { createRollupLicensePlugin } from 'rollup-license-plugin';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
export default [
{
  input: 'src/app.js',
  output: { file: 'dist/app.bundle.js', inlineDynamicImports: true, sourcemap: false },
  plugins: [commonjs(),nodeResolve(), createRollupLicensePlugin({ outputFilename: 'app_licenses.json' })]
},
{
  input: 'src/tool.js',
  output: { file: 'dist/tool.bundle.js', inlineDynamicImports: true, sourcemap: false },
  plugins: [commonjs(),nodeResolve(), json(),createRollupLicensePlugin({ outputFilename: 'tool_licenses.json' })]
}
]
