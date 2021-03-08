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

    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
          v-model="dialog"
        >
          <template>
            <v-card>
              <v-toolbar
                class="headline"
                color="primary"
                dark
              >記事の投稿に成功しました！</v-toolbar>
              <v-card-text>
                <div class="title pa-5">書いた記事をSNSでシェアしよう！</div>
              </v-card-text>
              <v-btn
                  class="mx-2 ml-10"
                  fab
                  dark
                  color="blue"
                  @click="share(articleId, 'twitter')"
                >
                  <v-icon dark>
                    mdi-twitter
                  </v-icon>
                </v-btn>
              <v-card-actions class="justify-end">
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="gotoHome"
                >
                  ホームへ戻る
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import mdEditor from '~/components/mdEditor'

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
        this.dialog = true

        // this.$router.push('/')
      }
    },
    share(articleId, sns) {
      const shareUrl = `https://monaledge.com/article/${articleId}`
      const hashTag = "%20%23モナレッジ %20%23モナコイン %20%23MONACOIN"
      let href = ""
      switch( sns ) {
        case 'twitter':
            href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${hashTag}`
            break
        case 'facebook':
            href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
            break
        case 'line':
            href = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`
            break
      }
      window.open(href, '_blank') // 新規タブでSNSのシェアページを開く
    },
    gotoHome() {
      this.dialog = false
      this.$router.push('/')
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
