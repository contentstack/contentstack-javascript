import { fileURLToPath } from 'node:url'
import { builtinModules } from 'module';
import { defineConfig } from 'rollup';

import { babel } from '@rollup/plugin-babel';
import commonJs from '@rollup/plugin-commonjs';
import nodeExternals from 'rollup-plugin-node-externals'
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

import pkg from '../package.json' assert { type: 'json' };


export default defineConfig({
  input: 'src/core/contentstack.js',
  output: {
    dir: './dist/web',
    format: 'umd'
  },
  plugins: [
    nodeExternals(),
    commonJs(),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ]
    }),
    replace({
      values: {
        'PLATFORM': 'web',
        'VERSION': pkg.version
      },
      delimiters: ['{{', '}}'],
      preventAssignment: true
    }),
    alias({
      entries: [
        { 
          find: 'runtime', 
          replacement: fileURLToPath(new URL('../src/runtime/web', import.meta.url))
        }
      ]
    }),
    terser()
  ],
  context: 'window',
  external: [
    ...builtinModules,
    ...Object.keys(pkg.devDependencies)
  ]
});