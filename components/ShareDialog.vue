<template>
  <div class="text-center">
    <v-dialog
      persistent
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
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
            @click="share('twitter')"
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
            @click="gotoHome()"
          >
            ホームへ戻る
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {
      dialog: true,
    }
  },
  methods: {
    share(sns) {
      const articleId = this.$store.state.postedArticleId
      const shareUrl = `https://monaledge.com/article/${articleId}`
      const text = `モナレッジに記事を書きました！%0a%E3%80%90${this.title}%E3%80%91%0a%0a%20%23モナレッジ %20%23モナコイン %20%23MONACOIN `
      const sampleText = "sssss"
      let href = ""
      switch( sns ) {
        case 'twitter':
            href = href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`
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
  }
}
</script>
