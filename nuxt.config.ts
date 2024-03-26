// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-auth-utils', 'nuxt-icon'],
  devtools: { enabled: true },
  // build: {
  //   transpile: ['NuxtExample']
  // }
  app: {
    head: {
      title: 'stepbuild',
      titleTemplate: "%s - stepbuild"
    }
  },
  runtimeConfig: {
    sessionPassword: 'a69ada35922e90fd13b2953afc169bdda4243cfe61afbc0a550f9525a2f2c83d'
  }
})

