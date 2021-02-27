<template>
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
        <span class="subheading mr-2">received {{sentMona}} MONA</span><br /><br />
        <span class="subheading mr-2">この記事の投稿者のアドレス : {{authorAddress}}</span><br /><br />


        <h1>{{title}}</h1><br /><br />
        <div class="contents" v-html="$md.render(content)"></div>
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
</template>



<script>
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data(){
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
    }
  },
  async fetch() {
    const res = await Api.get('article', {
      params: {
        id: this.$route.params.article_id
      }
    })

    this.article = res['data']
    this.title = res['data']['title']
    this.content = res['data']['content']
    this.sentMona = res['data']['sent_mona']
    this.authorName = res['data']['user']['name']
    this.authorAddress = res['data']['user']['address']

    const updatedObj = new Date(res['data']['updatedAt'])
    this.updated = updatedObj.getFullYear() + '年' + (Number(updatedObj.getMonth()) + 1) + '月' + updatedObj.getDate() + '日'
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
      console.log(sendResult)
    },
  },
  computed: {

  }
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
</style>
