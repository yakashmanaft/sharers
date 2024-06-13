// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-auth-utils', 'nuxt-icon', '@kevinmarrec/nuxt-pwa'],
  pwa: {
    workbox: {
      enabled: true
    }
    // https://www.npmjs.com/package/@kevinmarrec/nuxt-pwa
  },
  devtools: { enabled: true },
  // build: {
  //   transpile: ['NuxtExample']
  // }
  app: {
    head: {
      title: 'stepbuild',
      titleTemplate: "%s - stepbuild",
      charset: 'utf-8',
      viewport: 'user-scalable=no, width=device-width, initial-scale=1.0'
      
    }
  },
  // components: [
  //   {
  //     path: '~/components',
  //     pathPrefix: false,
  //   }, 
  // ],
  runtimeConfig: {
    sessionPassword: 'a69ada35922e90fd13b2953afc169bdda4243cfe61afbc0a550f9525a2f2c83d'
  }
})

