import { fileURLToPath } from 'node:url'
import { builtinModules } from 'module';
import { defineConfig } from 'rollup';

import swc from '@rollup/plugin-swc';
import commonJs from '@rollup/plugin-commonjs';
import nodeExternals from 'rollup-plugin-node-externals'
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

import pkg from '../package.json' assert { type: 'json' };


export default defineConfig({
  input: 'src/core/contentstack.js',
  output: {
    dir: './dist/react-native',
    format: 'commonjs'
  },
  plugins: [
    nodeExternals(),
    commonJs(),
    swc({
      exclude: 'node_modules/**',
      swc: {
        jsc: {
          target: 'es2015'
        }
      }
    }),
    replace({
      values: {
        'PLATFORM': 'react-native',
        'VERSION': pkg.version
      },
      delimiters: ['{{', '}}'],
      preventAssignment: true
    }),
    alias({
      entries: [
        { 
          find: 'runtime', 
          replacement: fileURLToPath(new URL('../src/runtime/react-native', import.meta.url))
        }
      ]
    }),
    terser({
      output: {
        ascii_only: true
      }
    })
  ],
  external: [
    ...builtinModules,
    ...Object.keys(pkg.devDependencies)
  ]
});