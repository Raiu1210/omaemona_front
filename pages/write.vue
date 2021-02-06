<template>
  <div class="editorView">
    <v-alert
      outlined
      type="warning"
      prominent
      border="left"
    >
      画像の投稿のところで「画像をアップロード」の機能はまだ未実装です。「画像のリンク」は動くのでお手数ですがしばらくの間はどこか別のところ（Imgurとか：https://imgur.com/）に画像をアップロードしたのちにリンクをこちらに貼って下さい m(-_-)m ｽﾏﾇ
    </v-alert>
    <!-- editor : no-ssr -->
    <no-ssr>
      <mavon-editor
        fontSize="18px"
        :toolbars="markdownOption"
        :language="'ja'"
        v-model="handbook"
      />
    </no-ssr>

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
export default {
  data() {
    return {
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
      handbook: "# Markdownで記事を書く！"
    };
  },
  methods: {
    postContent() {
      if (!confirm("この内容で投稿しますか？")) {
        console.log("not yet")
        return 0
      }

      console.log(this.handbook)
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
