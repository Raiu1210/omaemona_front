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

          <NuxtLink class="author_page_link" :to="`/user/${authorAddress}`">
            <span class="author_name">{{authorName}} &ensp;&ensp;&ensp;</span>
          </NuxtLink>

          <NuxtLink :to="`/?category=${article.category}`">
            <v-chip class="category_link float-right mt-0" color="success" small>
              {{getCategory(article.category)}}
            </v-chip>
          </NuxtLink>

          <br />
          <span class="updated_time">{{sentMona.toFixed(8)}} MONA</span><br />
          <span class="updated_time">{{covertTime(article.createdAt)}}に公開</span>&ensp;&ensp;&ensp;&ensp;<br />
          <span class="updated_time">{{article.access}} views</span><br />

          <h1>{{title}}</h1>
          <br />

          <!-- main content here -->
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


    <!-- add comment. if address is not registered, show sign up is needed -->
    <v-row>
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
import categoryUtils from '~/myModules/categoryUtils'


export default {
  data(){
    return {
      dialog: false,
      dialog2: false,
      tooltip: false,
      sendAmount: 0,
      inputComment: '',
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
  async mounted() {
    Prism.highlightAll()
    twttr.widgets.load()
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

      try {
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
      } catch (error) {
        console.error(error);
      }
    },
    async postComment(article_id) {
      let isMyAddressRegistered = await checkMyAddressRegistered()
      if (!isMyAddressRegistered['status']) {
        alert("コメントにはサインアップが必要だよ！")
        return
      }

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
    getCategory(number) {
      return categoryUtils.translateNumberToCategory(number)
    }
  },
  components: {
    RandomRecommend
  }
}
</script>


<style scoped lang="scss">
@import "~/styles/md-parse-style.css";


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

.author_page_link {
  text-decoration:none;
  color: black
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

.category_link {
  cursor: pointer;
}




// .post-content ::v-deep


::v-deep .booklink-box, .kaerebalink-box{
    padding:25px;
    margin-bottom: 10px;
    border:double #CCC;
    overflow: hidden;
    font-size:small;
}
::v-deep .booklink-image, .kaerebalink-image{
    margin:0 15px 0 0;
    float:left;
    min-width: 160px;
    text-align: center;
}
::v-deep .booklink-image img, .kaerebalink-image img{
    margin:0 auto;
    text-align:center;
}
::v-deep .booklink-info, .kaerebalink-info{
    margin:0;
    line-height:120%;
    overflow: hidden;
}
::v-deep .booklink-name, .kaerebalink-name{
    margin-bottom:24px;
    line-height:1.5em;
}
::v-deep .booklink-powered-date, .kaerebalink-powered-date{
     font-size:8px;
     margin-top:10px;
     font-family:verdana;
     line-height:120%;
}
::v-deep .booklink-detail, .kaerebalink-detail{font-size: 12px;}
::v-deep .booklink-powered-date, .kaerebalink-detail{margin-bottom:15px;}
::v-deep .booklink-link2, .kaerebalink-link1{margin-top:10px;}
::v-deep .booklink-link2 a,
::v-deep .kaerebalink-link1 a{
    width:30%;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border-radius:5px;
    display:inline-block;
    margin:5px 2px 0 0;
    padding:10px 1px;
    text-align:center;
    float:left;
    text-decoration:none;
    font-weight:800;
    text-shadow:1px 1px 1px #dcdcdc;
    font-size:12px;
    color: #fff !important;
}
::v-deep .booklink-link2 a:hover,
::v-deep .kaerebalink-link1 a:hover{opacity: 0.6;}
::v-deep .booklink-link2 a:active
::v-deep .kaerebalink-link1 a:active{
    position:relative;
    top:1px;
}
/*ボタンを変えるときはここから*/
::v-deep .shoplinkamazon a{background-color:#FF9901 !important;}
::v-deep .shoplinkrakuten a{background-color:#c20004 !important;}
::v-deep .shoplinkkindle a{background-color:#007dcd !important;}
::v-deep .shoplinkkakakucom a{background-color:#314995 !important;}
::v-deep .shoplinkyahoo a{background-color:#7b0099 !important;}
/*ここまでを変更*/
::v-deep .shoplinkyahoo img{display:none;}
::v-deep .shoplinkyahoo a{font-size:10px;}
::v-deep .booklink-footer{display: none;}

@media screen and (max-width: 680px) {
  ::v-deep .booklink-box, .kaerebalink-box{padding:15px;}
  ::v-deep .booklink-image, .kaerebalink-image{
      width: 100px !important;
      min-width: initial;
  }
  ::v-deep.booklink-name > a, .kaerebalink-name > a{
      font-size: 15px;
      font-weight: bold;
  }
  ::v-deep .booklink-name, .kaerebalink-name{margin-bottom:12px;}
  ::v-deep .booklink-powered-date, .kaerebalink-powered-date{margin-top:5px;}
  ::v-deep .booklink-link2 a,
  ::v-deep .kaerebalink-link1 a{
      width:calc(100% - 4px);
      -moz-border-radius:5px;
      -webkit-border-radius:5px;
      border-radius:5px;
      margin: 2px 0px;
      padding:10px 0px;
  }
}
</style>
