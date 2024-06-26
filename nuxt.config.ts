// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue', '@pinia/nuxt', '@nuxtjs/eslint-module'],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/variables.css',
    'primeicons/primeicons.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  imports: {
    dirs: ['composables', 'composables/**'],
  },
  primevue: {
    unstyled: true,
    importPT: { from: '~/presets/lara/' },
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './app/data/db',
      },
    },
  },
})
