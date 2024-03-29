import path from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript:{
    tsConfig: {
      "extends": "../../../tsconfig.base.json"
    }
  },
  devtools: { enabled: true },
  modules: ['nuxt-primevue', '@pinia/nuxt'],
  css: ['~/assets/css/main.css', '~/assets/css/variables.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  primevue: {
    options: {
      unstyled: true,
    },
    importPT: { from: path.resolve(__dirname, './presets/lara/') }
  }
})
