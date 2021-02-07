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
    this.address = await window.mpurse.getAddress()
  },
  methods: {
    async postContent() {
      if (!confirm("この内容で投稿しますか？")) {
        console.log("not yet")
        return 0
      }

      // @todo: need validation
      const postObj = {
        "title": this.title,
        "content": this.content
      }

      const result = await Api.post('/write', postObj)
    }
  }
};
</script>


<style scoped>
.editorView {
  width: 100%;
  height: 100%;
}
</style>
