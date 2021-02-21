import colors from 'vuetify/es5/util/colors'

// for localhost to https
import fs from 'fs'

export default {
  // https configuration
  server: {
    https: {
      // ===== dev =====
      key: fs.readFileSync('../../../ssl/localhost.key'),
      cert: fs.readFileSync('../../../ssl/localhost.crt')
    }
  },


  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - omaemona_front',
    title: 'オマエモナー',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '記事を書いてMONAがもらえる！気に入った記事にMONAが送れる！' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'オマエモナー' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://omaemona.info' },
      { hid: 'og:title', property: 'og:title', content: 'オマエモナー' },
      { hid: 'og:description', property: 'og:description', content: '記事を書いてMONAがもらえる！気に入った記事にMONAが送れる！' },
      { hid: 'og:image', property: 'og:image', content: 'https://omaemona.info/ogp/default.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '@/plugins/vue-mavon-editor',
      srr: false
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/markdownit'
  ],

  // markdown-it
  markdownit: {
    injected: true,   // $mdを使ってどこからでも使えるようになる
    breaks: true      // 改行を<br>に変換してくれる
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: "#ff9800",
          secondary: "#ffc107",
          accent: "#cddc39",
          error: "#f44336",
          warning: "#ff5722",
          info: "#00bcd4",
          success: "#4caf50"
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
