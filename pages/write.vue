<template>
  <div class="editorView">
    <!-- alert -->
    <v-row>
      <v-col cols="12">
        <v-alert
          outlined
          type="success"
        >
          <div class="title">
            記事を書こう！
          </div>
          <div>良い記事を書いたらモナコインがもらえるかも！</div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- title field -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          class="title_field"
          v-model="title"
          label="タイトル"
          height="50"
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- editor : no-ssr -->
    <v-row>
      <v-col>
        <no-ssr>
          <mdEditor v-model="content" />
        </no-ssr>
      </v-col>
    </v-row>

    <!-- post button -->
    <!-- @todo v-dialogとか使えばもっとおしゃれになりそう -->
    <v-btn
      class="ma-2"
      color="success"
      @click="postContent"
    >
      投稿する
    </v-btn>

    <ShareDialog v-if="dialog" />
  </div>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import mdEditor from '~/components/mdEditor'
import ShareDialog from '~/components/ShareDialog'

export default {
  data() {
    return {
      title: '',
      address: '',
      articleId: '',
      content: "# Markdownで記事を書く！",
      dialog: false
    };
  },
  async beforeMount() {
    let isMyAddressRegistered = await checkMyAddressRegistered()
    if (!isMyAddressRegistered['status']) {
      alert("記事を投稿するにはモナコインアドレスを登録する必要があります")
      this.$router.push('/signup')
    }
  },
  methods: {
    async postContent() {
      if (this.title == '') {
        alert("タイトルが入力されていないよ！")
        return
      }
      if (this.content == '') {
        alert("記事が入力されていないよ！")
        return
      }
      // アドレスの確認

      const date = new Date()
      const now = date.getTime()

      // 投稿への確認
      const address = await window.mpurse.getAddress()
      const message = "I will post this article : " + now
      const signature = await window.mpurse.signMessage(message)

      // @todo: need validation
      const postObj = {
        "title": this.title,
        "content": this.content,
        "address": address,
        "message": message,
        "signature": signature
      }

      const result = await Api.post('/write', postObj)
      if (result["status"] == 201) {
        this.articleId = result["data"]["result"]["id"]
        this.$store.commit('setMyArticleId', result["data"]["result"]["id"])
        this.dialog = true
      }
    }
  },
  components: {
    mdEditor,
    ShareDialog,
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
