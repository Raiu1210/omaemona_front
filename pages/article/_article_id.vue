<template>
  <v-row>
    <v-col
      cols="12"
      sm="1"
    >
      <v-sheet
        class="left_bar"
        rounded="lg"
        min-height="268"
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
        <h1>{{title}}</h1><br /><br />
        <div v-html="$md.render(content)"></div>
        <p>authorAddress</p>
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
      created: '',
      authorAddress: '',
      dialog: false,
      tooltip: false,
      sendAmount: 0,
    }
  },
  async created() {
    const res = await Api.get('article', {
      params: {
        id: this.$route.params.article_id
      }
    })

    this.article = res['data']
    this.title = res['data']['title']
    this.content = res['data']['content']
    this.created = res['data']['createdAt']
    this.authorAddress = res['data']['user']['address']
  },
  methods: {
    sendMona() {
      this.dialog = false
      console.log(this.sendAmount)
    }
  }
}
</script>


<style scoped>
.mona_input {
  width: 200px;
}
</style>
