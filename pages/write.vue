<template>
  <div class="editorView">
    <!-- alert -->
    <v-row>
      <v-col cols="12">
        <v-alert
          outlined
          type="warning"
          prominent
          border="left"
        >
          画像の投稿のところで「画像をアップロード」の機能はまだ未実装です。「画像のリンク」は動くのでお手数ですがしばらくの間はどこか別のところ（Imgurとか：https://imgur.com/）に画像をアップロードしたのちにリンクをこちらに貼って下さい m(-_-)m ｽﾏﾇ
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-alert
          outlined
          type="warning"
          prominent
          border="left"
        >
          日本語だとだいたい2万文字くらいまでしか1記事に入らないと思うので、超大作を作る方は2万文字を目安に分けてね！
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
          <mavon-editor
            fontSize="18px"
            :toolbars="markdownOption"
            :language="'ja'"
            v-model="content"
          />
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
  </div>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'

export default {
  data() {
    return {
      title: '',
      address: '',
      markdownOption: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        fullscreen: true,
        readmodel: true,
        htmlcode: true,
        help: true,
      },
      content: "# Markdownで記事を書く！"
    };
  },
  async beforeMount() {
    window.mpurse.updateEmitter.removeAllListeners()
      .on('stateChanged', isUnlocked => console.log(isUnlocked))
      .on('addressChanged', address => console.log(address));

    let isMyAddressRegistered = await checkMyAddressRegistered()
    if (!isMyAddressRegistered['status']) {
      alert("記事を投稿するにはモナコインアドレスを登録する必要があります")
      this.$router.push('/signup')
    }
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
        "title": this.title,
        "content": this.content,
        "address": address,
        "message": message,
        "signature": signature
      }

      const result = await Api.post('/write', postObj)
      if (result["status"] == 201) {
        alert("記事の投稿に成功しました！")
        this.$router.push('/')
      }
    }
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
