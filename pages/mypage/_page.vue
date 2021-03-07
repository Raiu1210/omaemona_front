<template>
  <v-container>
    <!-- ユーザのカード -->
    <v-row justify="center" align-content="center">
      <v-col cols="10">
        <v-card class="mx-auto pa-5">
          <v-row class="pa-5">
            <v-list-item-avatar color="grey darken-3">
              <v-img
                class="elevation-6 pa-5"
                alt=""
                :src="iconImagePath"
              ></v-img>
            </v-list-item-avatar>
            <v-card-title class="display-1 text--primary">
              {{userInfo['name']}}
            </v-card-title>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card-text>
                Monacoinアドレス : {{userInfo['address']}}
              </v-card-text>
            </v-col>
          </v-row>

          <!-- 編集&削除ボタン -->
          <v-row
            align="center"
            justify="end"
          >
            <!-- 編集ボタン -->
            <v-btn
              class="ma-2"
              color="success"
              @click="showEditView()"
            >
              編集
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>


    <!-- 書いた記事一覧 -->
    <h2 class="my-8">全ての投稿</h2>
    <v-row
        v-for="article in myArticles"
        :key="article.id"
      >
      <v-col>
        <v-card
          class="mx-auto"
          color="#ffffff"
        >
          <nuxt-link style="text-decoration: none; color: inherit;" :to="`/article/${article.id}`">
            <v-card-text class="headline font-weight-bold mb-0 pb-0">
              {{article.title}}
            </v-card-text>

            <v-card-subtitle class="pt-0">
              {{covertUpdateTime(article.updatedAt)}}
            </v-card-subtitle>

            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                    class="elevation-6"
                    alt=""
                    :src="iconImagePath"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{userInfo['name']}}</v-list-item-title>
                </v-list-item-content>

                <v-row
                  align="center"
                  justify="end"
                >
                  <v-icon class="mr-1">
                    mdi-alpha-m-circle-outline
                  </v-icon>
                  <span class="subheading mr-2">{{article.sent_mona.toFixed(8)}} MONA</span>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </nuxt-link>

          <!-- 編集&削除ボタン -->
          <v-row
            align="center"
            justify="end"
          >
            <!-- 編集ボタン -->
            <v-btn
              class="ma-2"
              color="success"
              @click="gotoEditPage(article.id)"
            >
              編集
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>

            <!-- 削除ボタン -->
            <v-btn
              class="ma-2 mr-8"
              color="error"
              @click="deleteArticle(article.id)"
            >
              削除
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

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
    <ProfileEdit
      :name="userInfo['name']"
      :icon_image_path="iconImagePath"
      @closeEditView="closeEditView"
      v-if="editMode" />
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import NotRegisteredAlert from '~/components/NotRegisteredAlert'
import ProfileEdit from '~/components/ProfileEdit'

export default {
  data() {
    return {
      userInfo: {},
      myArticles: [],
      page: 0,
      pageLength: 0,
      dialog: false,
      editMode: false
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
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    gotoEditPage(articleId) {
      this.$router.push(`/edit/${articleId}`)
    },
    showEditView() {
      this.editMode = true
    },
    closeEditView() {
      this.editMode = false

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
  computed: {
    iconImagePath() {
      const env = process.env.NODE_ENV || 'development'
      let url = 'https://monaledge.com:8443'
      if(env == 'development') {
        url = 'http://localhost:3333'
      }

      if(this.userInfo['icon_image_path'] == null) {
        return url + '/profileImages/Monacoin.png'
      } else {
        return this.userInfo['icon_image_path']
      }
    }
  },
  components: {
    NotRegisteredAlert,
    ProfileEdit
  }
}
</script>
