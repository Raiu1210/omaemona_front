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

      <nuxt-link to="/">
        <v-toolbar-title class="white--text" v-text="title" />
      </nuxt-link>

      <v-spacer />

      <!-- @todo : 公開鍵からユーザを特定して表示したい -->
      <NuxtLink to="/mypage">
        <v-avatar color="">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </NuxtLink>

    </v-app-bar>
    <v-main>
      <v-container fluid class="pa-0 mb-12">
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
      color="#3e3e3e"
      class="white--text mt-5"
      app
    >
      <v-row>
        <v-col cols="3">
          <div class="pa-10">
            <h1>モナレッジ</h1>
            <p class="mt-3">開発・運営 : 変態物理(らいう)</p>
            <v-row>
              <v-col cols="3">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="blue"
                  href="https://twitter.com/Mr_1484"
                >
                  <v-icon dark>
                    mdi-twitter
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="black"
                  href="https://twitter.com/Mr_1484"
                >
                  <v-icon dark>
                    mdi-github
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-spacer></v-spacer>
        <!-- links -->
        <v-col>
          <div class="pa-10">
            <NuxtLink class="links" to="/terms"><p class="mt-3 ml-8">利用規約</p></NuxtLink>
          </div>
        </v-col>
      </v-row>
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
}
</script>


<style scoped>
.v-application {
  background-color: #f5f5f5;
}

.links {
  text-decoration: none;
  color: #f5f5f5;
}
</style>
