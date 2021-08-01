<template>
  <v-container class="editorView mt-5">
    <!-- title field -->
    <v-row>
      <v-col cols="9">
        <v-text-field
          class="title_field"
          v-model="title"
          label="タイトル"
          height="50"
          outlined
          dense
        ></v-text-field>
      </v-col>

      <v-col
        cols="3"
      >
        <v-select
          :items="categories"
          item-text="name"
          item-value="id"
          v-model="selectedCategoryId"
          solo
        ></v-select>
      </v-col>
    </v-row>

    <!-- editor : no-ssr -->
    <v-row>
      <v-col>
        <client-only>
          <mdEditor v-model="content" />
        </client-only>
      </v-col>
    </v-row>

    <!-- post button -->
    <!-- @todo v-dialogとか使えばもっとおしゃれになりそう -->
    <v-btn
      class="ma-2"
      color="success"
      @click="postContent"
    >
      更新する
    </v-btn>
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import mdEditor from '~/components/mdEditor'
import categoryUtils from '~/myModules/categoryUtils'


export default {
  data() {
    return {
      article: null,
      title: '',
      content: '',
      updated: '',
      authorName: '',
      sentMona: 0,
      authorAddress: '',
      dialog: false,
      tooltip: false,
      sendAmount: 0,
      categories: [],
      selectedCategoryId: 0
    };
  },
  async created() {
    const res = await Api.get('article', {
      params: {
        id: this.$route.params.article_id
      }
    })

    this.title = res['data']['title']
    this.content = res['data']['content']
    this.sentMona = res['data']['sent_mona']
    this.authorName = res['data']['user']['name']
    this.authorAddress = res['data']['user']['address']
    this.selectedCategoryId = res['data']['category']
    const updatedObj = new Date(res['data']['updatedAt'])
    this.updated = updatedObj.getFullYear() + '年' + updatedObj.getMonth() + '月' + updatedObj.getDate() + '日'
    this.categories = categoryUtils.getCategoriesObj()
  },
  methods: {
    async postContent() {
      // アドレスの確認

      const date = new Date()
      const now = date.getTime()

      // 投稿への確認
      const address = await window.mpurse.getAddress()
      const message = "I will post this article : " + now
      const signature = await window.mpurse.signMessage(message)

      // @todo: need validation
      const postObj = {
        "articleId": this.$route.params.article_id,
        "title": this.title,
        "content": this.content,
        "address": address,
        "message": message,
        "signature": signature,
        "category": this.selectedCategoryId
      }

      const result = await Api.post('/updateArticle', postObj)
      if (result["status"] == 201) {
        alert("記事の更新に成功しました！")
        this.$router.push('/mypage')
      }
    }
  },
  components: {
    mdEditor
  }
};
</script>


<style scoped>
.editorView {
  width: 100%;
  height: 100%;
}

.title_field {
  background-color: white;
  height: 50px;
}
</style>
