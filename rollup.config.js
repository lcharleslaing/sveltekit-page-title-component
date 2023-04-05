import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/PageTitle.svelte',
    output: {
        file: 'dist/PageTitle.bundle.js',
        format: 'iife',
        name: 'PageTitle'
    },
    plugins: [
        svelte(),
        resolve(),
        terser()
    ]
};
