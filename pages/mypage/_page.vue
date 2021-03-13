<template>
  <v-container>
    <!-- ユーザのカード -->
    <UserCard :userInfo="userInfo" :editable="true" />


    <!-- 書いた記事一覧 -->
    <h2 class="my-8">全ての投稿</h2>
    <UserArticlesTimeline :userInfo="userInfo" :articles="myArticles" :editable="true" />

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
  async beforeMount() {
    // check address registered
    const isMyAddressRegistered = await checkMyAddressRegistered()
    if (!isMyAddressRegistered['status']) {
      this.dialog = true
    }

    const address = await window.mpurse.getAddress()
    const postObj = {
      address: address
    }
    const myInfo = await Api.post('myInfo', postObj)
    this.userInfo = myInfo['data']

    const postObj2 = {
      page: this.$route.params.page == undefined ? 1 : Number(this.$route.params.page),
      author_id: this.userInfo['id']
    }
    const myArticles = await Api.post('myArticles', postObj2)
    this.myArticles = myArticles['data']['articles']
    const articlesCount = myArticles["data"]["articlesCount"]
    this.page = this.$route.params.page == undefined ? 1 : Number(this.$route.params.page)
    this.pageLength = Math.ceil(articlesCount / 10)

    console.log(myArticles)
  },
  methods: {
    async deleteArticle(articleId) {
      // 削除確認
      if(!confirm("この記事を削除しますか")) {
        return 0
      }
      // 削除のリクエスト
      const date = new Date()
      const now = date.getTime()
      const address = await window.mpurse.getAddress()
      const message = `I will delete article id ${articleId}:${now}`
      const signature = await window.mpurse.signMessage(message)

      const postObj = {
        articleId: articleId,
        address: address,
        message: message,
        signature: signature
      }
      const response = await Api.post('deleteArticle', postObj)
      if(response['data']['status'] == 0) {
        alert("記事を削除しました")
        this.refreshPage()
      }
    },
    iconImagePath(path) {
      return generateIconImagePath(path)
    },
    async refreshPage() {
      const address = await window.mpurse.getAddress()
      const postObj = {
        address: address
      }
      const response = await Api.post('myInfo', postObj)
      this.userInfo = response['data']
    },
    gotoPageN(page) {
      this.$router.push(`/mypage/${page}`)
    }
  },
  components: {
    NotRegisteredAlert,
    UserCard
  }
}
</script>
