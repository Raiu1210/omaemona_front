<template>
  <v-row>
    <v-col
      cols="12"
      sm="1"
    >
      <v-sheet
        rounded="lg"
        min-height="268"
      >
        <!--  -->
      </v-sheet>
    </v-col>

    <v-col
      cols="12"
      sm="9"
    >
      <v-sheet
        min-height="70vh"
        rounded="lg"
      >
        <!-- コンテンツ表示 -->
        <!-- {{article}} -->
        <h1>{{title}}</h1>
        <div v-html="$md.render(content)"></div>
        <p>authorAddress</p>
      </v-sheet>
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
      authorAddress: ''
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
  }
}
</script>
