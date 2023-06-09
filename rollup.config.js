import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    plugins: [
        json(),
        ts({
            browserslist: ["last 2 versions", "not dead", "> 0.2%"]
        }),
        terser({
            output: {
                comments: false
            }
        })
    ],
    input: 'src/autoscroll.ts',
    output: [
        {
            file: 'dist/autoscroll.js',
            format: 'iife'
        }
    ]
};