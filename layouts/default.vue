<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-container>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title grey--text text--darken-2">
              機能一覧
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list>
          <v-list-item
            @click.stop="drawer = !drawer"
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      color="primary"
      app
    >
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <nuxt-link to="/">
        <v-toolbar-title class="white--text" v-text="title" />
      </nuxt-link>

      <v-spacer />

      <v-btn icon color="white">
        <v-icon @click="reload">mdi-cached</v-icon>
      </v-btn>

      <!-- @todo : 公開鍵からユーザを特定して表示したい -->
      <NuxtLink to="/mypage" v-if="this.$store.state.verified">
        <v-avatar color="">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </NuxtLink>

    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>


<script>
import checkMyAddress from '~/myModules/checkMyAddress'

export default {
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'ホーム',
          to: '/'
        },
        {
          icon: 'mdi-pencil-plus',
          title: '記事を書く',
          to: '/write'
        },
        {
          icon: 'mdi-account-plus',
          title: 'サインアップ',
          to: '/signup'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'モナレッジ'
    }
  },
  async beforeMount() {
    const checkResult = await checkMyAddress()
    if(checkResult['status']) {
      this.$store.commit('setVerified', checkResult['userInfo']['address'])
    }
  },
  methods: {
    reload() {
      location.reload()
    }
  }
}
</script>


<style scoped>
.v-application {
  background-color: #f5f5f5;
}
</style>
