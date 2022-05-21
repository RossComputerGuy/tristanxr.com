import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@intlify/nuxt3',
    '@nuxtjs/google-fonts',
  ],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          '@tailwindcss/nesting': {},
        },
      },
    },
  },
  googleFonts: {
    families: {
      Inter: true,
    },
  },
  tailwindcss: {
    jit: true,
  },
  intlify: {
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          website: {
            name: 'Tristan Ross',
          },
          page: {
            home: 'Home',
          },
        },
      },
    },
  },
})
