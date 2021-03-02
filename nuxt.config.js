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
    title: 'モナレッジ',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      // setting
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // meta info
      // { hid: 'description', name: 'description', content: '記事を書いてMONAがもらえる！気に入った記事にMONAが送れる！' },
      { hid: 'og:title', property: 'og:title', content: 'モナレッジ' },
      { hid: 'og:image', property: 'og:image', content: 'https://omaemona.info/default.png' },
      { hid: 'og:description', property: 'og:description', content: '記事を書いてMONAがもらえる！気に入った記事にMONAが送れる！' },
      { hid: 'og:url', property: 'og:url', content: 'https://omaemona.info' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'モナレッジ' },

      // for twitter
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@Mr_1484'},
      { hid: 'twitter:site', name: 'twitter:site', content: '@Mr_1484' },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'モナレッジ' },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://omaemona.info/default.png'},
      { hid: 'twitter:description', name: 'twitter:description', content: '記事を書いてMONAがもらえる！気に入った記事にMONAが送れる！'},
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
    { src: '@/plugins/vue-mavon-editor', srr: false },
    { src: '~/plugins/prism', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/markdownit',
    '@nuxt/content',
    [
      '@nuxtjs/google-gtag',
      {
        id: 'G-B3D41C59FK',
        debug: true
      }
    ],
    [
      '@nuxtjs/google-adsense', {
        id: "ca-pub-9410270200655875",
        pageLevelAds: true
      }
    ]
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
