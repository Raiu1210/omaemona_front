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
        sm="8"
      >
        <v-sheet
          class="pa-10"
          min-height="70vh"
          rounded="lg"
          max-width="900px"
        >
          <!-- コンテンツ表示 -->
          <!-- {{article}} -->
          <NuxtLink :to="`/user/${authorAddress}`">
            <v-list-item-avatar color="grey darken-3">
              <v-img
                class="pa-0 elevation-6"
                :src="iconImagePath(authorIconImagePath)"
              ></v-img>
            </v-list-item-avatar>
          </NuxtLink>
          <span class="author_name">{{authorName}} &ensp;&ensp;&ensp;</span><br />
          <span class="updated_time">{{covertTime(article.createdAt)}}に公開</span>&ensp;&ensp;&ensp;&ensp;<br />
          <span class="updated_time">{{article.access}} views</span><br />

          <h1>{{title}}</h1>
          <v-icon class="mr-1">
            mdi-alpha-m-circle-outline
          </v-icon>
          <span class="subheading mr-2">received {{sentMona.toFixed(8)}} MONA</span><br />
          <span class="subheading mr-2">この記事の投稿者のアドレス : {{authorAddress}}</span><br /><br />
          <br /><br />

          <div class="post-content line-numbers contents" v-html="$md.render(content)"></div>
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

        <!-- twitter share -->
        <v-tooltip bottom>
          <template #activator="{ on: tooltip2 }">
            <v-btn
              class="mx-2"
              fab
              dark
              color="blue"
              @click="share($route.params.article_id, 'twitter')"
              v-on="{ ...tooltip2 }"
            >
              <v-icon dark>
                mdi-twitter
              </v-icon>
            </v-btn>
          </template>
          <span>この記事をシェアする</span>
        </v-tooltip>
      </v-col>

      <v-col
        cols="12"
        sm="3"
      >
        <v-sheet
          class="right_bar"
          color="#f5f5f5"
          rounded="lg"
          min-height="268"
        >
          <adsbygoogle
            ad-slot="7292031388"
          />
          <adsbygoogle
            ad-slot="9668775101"
          />
        </v-sheet>

        <RandomRecommend />
      </v-col>
    </v-row>


    <v-row v-if="addressRegistered">
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


    <!-- add comment. if address is not registered, show sign up is needed -->
    <v-row v-else>
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

    <v-row>
      <!-- null space -->
      <v-col cols="1"></v-col>

      <!-- display comment -->
      <v-col cols="10">
        <v-timeline dense v-if="comments.length > 0">
          <v-timeline-item v-for="comment in comments" :key="comment.id" large>
            <template v-slot:icon>
              <v-avatar>
                <img :src="iconImagePath(comment['user']['icon_image_path'])">
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

    <v-row>
      <v-col cols="6">
        <adsbygoogle
          ad-slot="3100331471"
        />
      </v-col>
      <v-col cols="6">
        <adsbygoogle
          ad-slot="9474168139"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import Prism from '~/plugins/prism'
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import RandomRecommend from '~/components/RandomRecommend'

export default {
  data(){
    return {
      dialog: false,
      dialog2: false,
      tooltip: false,
      sendAmount: 0,
      inputComment: '',
      addressRegistered: false,
      gadStyle: {
        display:'inline-block',
        width:'300px',
        height:'250px'
      }
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
      authorIconImagePath: res['data']['user']['icon_image_path'],
      comments: res['data']['comments'],
      updated: updatedObj.getFullYear() + '年' + (Number(updatedObj.getMonth()) + 1) + '月' + updatedObj.getDate() + '日',
      ogpPath: res['data']['ogp_path'] == null ? 'https://monaledge.com/monaledge.jpeg' : res['data']['ogp_path']
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
        { hid: 'og:image', property: 'og:image', content: this.ogpPath },
        { hid: 'twitter:image', name: 'twitter:image', content: this.ogpPath }
      ],
    }
  },
  async beforeMount() {
    let isMyAddressRegistered = await checkMyAddressRegistered()
    if (!isMyAddressRegistered['status']) {
      this.addressRegistered = true
    }
  },
  async mounted() {
    Prism.highlightAll()
  },
  methods: {
    async updateView() {
      const res = await Api.get('article', {
        params: {
          id: this.$route.params.article_id
        }
      })
      this.sentMona = res['data']['sent_mona']
      this.comments = res['data']['comments']
      this.inputComment = ''
    },
    async sendMona() {
      this.dialog = false
      const address = await window.mpurse.getAddress()
      const txHash = await window.mpurse.sendAsset(
        this.authorAddress,
        'MONA',
        this.sendAmount,
        'plain',
        'LGTM'
      )
      const postObj = {
        from: address,
        article_id: this.$route.params.article_id,
        amount: this.sendAmount,
        txHash: txHash,
        authorId: this.article['author_id']
      }

      const sendResult = await Api.post('/sendMonaToArticle', postObj)
      this.updateView()
      alert("この記事の作者に投げ銭したよ！")
    },
    async postComment(article_id) {
      if(this.inputComment == '') {
        alert("空のコメントはうけつけられないよ！")
        return
      }
      const date = new Date()
      const now = date.getTime()

      // 投稿への確認
      const address = await window.mpurse.getAddress()
      const message = "I will comment this article : " + now
      const signature = await window.mpurse.signMessage(message)

      // @todo: need validation
      const postObj = {
        address: address,
        message: message,
        signature: signature,
        article_id: article_id,
        comment: this.inputComment,
        authorId: this.article['author_id']
      }

      const result = await Api.post('/addComment', postObj)
      if (result["status"] == 201) {
        alert("コメントを投稿したよ！")
        this.updateView()
      }
    },
    covertTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    iconImagePath(iconImagePath) {
      const env = process.env.NODE_ENV || 'development'
      let url = 'https://monaledge.com:8443'
      if(env == 'development') {
        url = 'http://localhost:3333'
      }

      if(iconImagePath == null) {
        return url + '/profileImages/Monacoin.png'
      } else {
        return iconImagePath
      }
    },
    share(articleId, sns) {
      const shareUrl = `https://monaledge.com/article/${articleId}`
      const text = `%E3%80%90${this.title}%E3%80%91%0a%0a%20%23モナレッジ %20%23モナコイン %20%23MONACOIN`
      let href = ""
      switch( sns ) {
        case 'twitter':
            href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`
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
  },
  components: {
    RandomRecommend
  }
}
</script>


<style scoped lang="scss">
::v-deep table, ::v-deep td, ::v-deep th {
  border: 2px #808080 solid;
}

::v-deep td, ::v-deep th {
  padding: 5px 10px;
}

::v-deep h1, ::v-deep h2, ::v-deep h3, ::v-deep h4 {
  margin-top: 50px;
  margin-bottom: 20px;
}

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
