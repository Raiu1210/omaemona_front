<template>
  <v-container>
    <!-- ユーザのカード -->
    <UserCard :userInfo="userInfo" :editable="false" />


    <!-- 書いた記事一覧 -->
    <h2 class="my-8">全ての投稿</h2>
    <UserArticlesTimeline :userInfo="userInfo" :articles="myArticles" :editable="false" />

    <v-row>
      <v-col style="justify-content: center;">
      <v-pagination
        v-model="page"
        :length="pageLength"
        :total-visible="7"
        @input = "gotoPageN"
      ></v-pagination>
      </v-col>
    </v-row>

    <NotRegisteredAlert v-if="dialog" />
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import generateIconImagePath from '~/myModules/generateIconImagePath'

import NotRegisteredAlert from '~/components/NotRegisteredAlert'
import UserCard from '~/components/UserCard'
import UserArticlesTimeline from '~/components/UserArticlesTimeline'

export default {
  data() {
    return {
      userInfo: {},
      myArticles: [],
      page: 0,
      pageLength: 0,
      dialog: false,
    }
  },
  async created() {
    const address = this.$route.params.address
    const postObj = {
      address: address
    }
    const myInfo = await Api.post('myInfo', postObj)
    this.userInfo = myInfo['data']

    const postObj2 = {
      page: this.$route.query.page == undefined ? 1 : Number(this.$route.query.page),
      author_id: this.userInfo['id']
    }

    const myArticles = await Api.post('myArticles', postObj2)
    this.myArticles = myArticles['data']['articles']
    const articlesCount = myArticles["data"]["articlesCount"]
    this.page = this.$route.query.page == undefined ? 1 : Number(this.$route.query.page)
    this.pageLength = Math.ceil(articlesCount / 10)
  },
  methods: {
    iconImagePath(path) {
      return generateIconImagePath(path)
    },
    gotoPageN(page) {
      this.$router.push({
        path: `/user/${this.$route.params.address}`,
        query: {page: page}
      })
    }
  },
  async watchQuery(newQuery, oldQuery) {
    const address = this.$route.params.address
    const postObj = {
      address: address
    }
    const myInfo = await Api.post('myInfo', postObj)
    this.userInfo = myInfo['data']

    const postObj2 = {
      page: this.$route.query.page == undefined ? 1 : Number(this.$route.query.page),
      author_id: this.userInfo['id']
    }

    const myArticles = await Api.post('myArticles', postObj2)
    this.myArticles = myArticles['data']['articles']
    const articlesCount = myArticles["data"]["articlesCount"]
    this.page = this.$route.query.page == undefined ? 1 : Number(newQuery['page'])
    this.pageLength = Math.ceil(articlesCount / 10)
  },
  components: {
    NotRegisteredAlert,
    UserCard
  }
}
</script>
