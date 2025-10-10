import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [react(), tailwindcss(), dts({ insertTypesEntry: true })],
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'MCI_UI',
			formats: ['es', 'cjs'],
			fileName: format => `mci-ui-lib.${format}.js`,
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
		sourcemap: true,
		minify: true,
	},
})
