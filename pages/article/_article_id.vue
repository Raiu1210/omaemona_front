<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="1"
      >
        <v-sheet
          class="left_bar"
          color="#f5f5f5"
          rounded="lg"
          min-height="10"
        >

        </v-sheet>
      </v-col>

      <v-col
        cols="12"
        sm="9"
      >
        <v-sheet
          class="pa-10"
          min-height="70vh"
          rounded="lg"
        >
          <!-- コンテンツ表示 -->
          <!-- {{article}} -->
          <span class="author_name">{{authorName}} &ensp;&ensp;&ensp;</span>
          <span class="updated_time">{{updated}}に更新</span>&ensp;&ensp;&ensp;&ensp;
          <v-icon class="mr-1">
            mdi-alpha-m-circle-outline
          </v-icon>
          <span class="subheading mr-2">received {{sentMona.toFixed(8)}} MONA</span><br /><br />
          <span class="subheading mr-2">この記事の投稿者のアドレス : {{authorAddress}}</span><br /><br />


          <h1>{{title}}</h1><br /><br />
          <div class="prism line-numbers contents" v-html="$md.render(content)"></div>
        </v-sheet>

        <!-- send MONA -->
        <v-dialog
          v-model="dialog"
          persistent
          max-width="290"
        >
          <template #activator="{on: dialog}">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  class="ma-3 pa-6"
                  fab
                  dark
                  large
                  color="pink"
                  v-on="{ ...tooltip, ...dialog }"
                >
                  <v-img
                    src="/monacoin.png"
                    max-height="60"
                    max-width="60"
                  />
                  </v-btn>
              </template>
              <span>記事の作者にMONAを送る</span>
            </v-tooltip>
          </template>

          <v-card>
            <v-card-title class="headline grey lighten-2">
              MONAを著者に送る
            </v-card-title><br />

            <center>
              <v-text-field
                class="mona_input"
                label="MONA"
                placeholder="1.14114"
                v-model="sendAmount"
                outlined
              ></v-text-field>
            </center>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                v-on:click="sendMona"
              >
                Send
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col
        cols="12"
        sm="2"
      >
        <v-sheet
          class="right_bar"
          color="#f5f5f5"
          rounded="lg"
          min-height="268"
        >

        </v-sheet>
      </v-col>
    </v-row>

    <!-- add comment -->
    <v-row v-if="this.$store.state.verified">
      <!-- null space -->
      <v-col cols="1"></v-col>

      <!-- content -->
      <v-col cols="9">
        <v-textarea
          class="px-5 mb-0"
          solo
          name="input-7-1"
          label="コメントを追加"
          v-model="inputComment"
          auto-grow
        ></v-textarea>

        <v-btn
          class="mx-5"
          color="success"
          @click="postComment(article.id)"
        >
          投稿
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <!-- null space -->
      <v-col cols="1"></v-col>

      <!-- content -->
      <v-col cols="9">
        <v-alert text
          border="top"
          colored-border
          type="info"
          elevation="2"
        >
          コメントをするためにはmpurseをインストールしてサインアップする必要があります。<br />サインアップは
          <nuxt-link to="/signup">
            こちら
          </nuxt-link>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <!-- null space -->
      <v-col cols="1"></v-col>

      <!-- display comment -->
      <v-col cols="10">
        <v-timeline dense v-if="comments.length > 0">
          <v-timeline-item v-for="comment in comments" :key="comment.id" large>
            <template v-slot:icon>
              <v-avatar>
                <img src="/monacoin.png">
              </v-avatar>
            </template>
            <v-card class="elevation-2">
              <v-card-text class="comment subtitle-1">{{comment['comment']}}</v-card-text>
              <v-card-text class="name_tag">{{comment['user']['name']}}</v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import Prism from '~/plugins/prism'
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data(){
    return {
      dialog: false,
      tooltip: false,
      sendAmount: 0,
      inputComment: ''
    }
  },
  async asyncData({ params, $http }) {
    const res = await Api.get('article', {
      params: {
        id: params['article_id']
      }
    })
    const updatedObj = new Date(res['data']['updatedAt'])

    return {
      article: res['data'],
      title: res['data']['title'],
      content: res['data']['content'],
      sentMona: res['data']['sent_mona'],
      authorName: res['data']['user']['name'],
      authorAddress: res['data']['user']['address'],
      comments: res['data']['comments'],
      updated: updatedObj.getFullYear() + '年' + (Number(updatedObj.getMonth()) + 1) + '月' + updatedObj.getDate() + '日'
    }
  },
  head(){
    return {
      title: this.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.content },
        { hid: 'twitter:title', name: 'twitter:title', content: this.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.content },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  async mounted() {
    Prism.highlightAll()
  },
  methods: {
    async sendMona() {
      this.dialog = false
      const txHash = await window.mpurse.sendAsset(
        this.authorAddress,
        'MONA',
        this.sendAmount,
        'plain',
        'LGTM'
      )
      const postObj = {
        article_id: this.$route.params.article_id,
        amount: this.sendAmount
      }

      const sendResult = await Api.post('/log_tip', postObj)
    },
    async postComment(article_id) {
      const date = new Date()
      const now = date.getTime()

      // 投稿への確認
      const address = await window.mpurse.getAddress()
      const message = "I will comment this article : " + now
      const signature = await window.mpurse.signMessage(message)

      // @todo: need validation
      const postObj = {
        "address": address,
        "message": message,
        "signature": signature,
        "article_id": article_id,
        "comment": this.inputComment
      }

      const result = await Api.post('/addComment', postObj)
      if (result["status"] == 201) {
        alert("記事の投稿に成功しました！")
        location.reload()
      }
    }
  },
}
</script>


<style scoped lang="scss">
.contents ::v-deep img {
  max-width: 500px;
  width: 100%;
  height: auto;
}

.contents > img {
  width: 100px;
  height: auto;
}

.mona_input {
  width: 200px;
}

.author_name {
  font-size: 16pt;
}

.updated_time {
  font-size: 10pt;
  color: #808080;
}

.left_bar {
  background-color: '#f5f5f5';
}

.right_bar {
  background-color: '#f5f5f5';
}

.name_tag {
  text-align: right;
}
</style>
