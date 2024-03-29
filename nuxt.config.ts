// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    unstyled: true,
    importPT: { from: '~/presets/lara/' } 
  },
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './app/data/db'
      }
    }
  }
  
})
