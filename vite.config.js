import {
    defineConfig
  } from 'vite'
  import vue from '@vitejs/plugin-vue'
  const path = require('path')
  
  const baseUrl = {
    development: './',
    beta: './',
    release: './'
  }
  
  // https://vitejs.dev/config/
  export default ({
    mode
  }) => defineConfig({
    plugins: [vue()],
    base: baseUrl[mode],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        '/v1': {
          // target: 'http://10.1.16.238:9091/',
          target: 'http://10.0.4.160:9091/',
          changeOrigin: true,
        },
      }
    }
  })