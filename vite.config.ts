import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
import vitePluginSvgr from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        vitePluginSvgr(),
        react(),
        tailwindcss(),
        dts({
            insertTypesEntry: true,
            outDir: 'dist/types',
            exclude: ['src/App.tsx', 'src/main.tsx'],
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'MciUi',
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@solar-icons/react',
                'clsx',
                'tailwind-merge',
                'react-dom/client',
                'react-dom/server',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'React',
                    'react-dom/client': 'ReactDOM',
                    'react-dom/server': 'ReactDOM',

                    '@solar-icons/react': 'SolarIcons',
                    clsx: 'clsx',
                    'tailwind-merge': 'tailwindMerge',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'index.css'
                    return assetInfo.name!
                },
            },
        },

        cssCodeSplit: true,
        sourcemap: false,
        minify: 'esbuild',
        emptyOutDir: true,
    },
})
