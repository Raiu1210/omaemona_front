<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-alert
        outlined
        type="warning"
        prominent
        border="left"
      >
        とても反響があってびっくりしています。皆様にはご不便をおかけしますが、このサービスは開発段階です。
        本番環境でないとわからない挙動のテスト等があるため、ざっと形になった時点で稼働をしています。
        まだまだバグだらけかつ、想定している機能も作り切れていないので、
        書き込んでいただいた記事は後方互換性のないDBのアップデートの際に失われてしまう可能性がありますのでご了承ください。
        自分的にある程度納得したβ版っぽいところまで開発ができたら、twitter, このページでアナウンスしようと思っているのでよろしくお願いいたします
      </v-alert>
    </v-col>
    <v-col
      cols="12"
      sm="3"
    >
      <v-sheet
        color="#f5f5f5"
        rounded="lg"
        min-height="2vh"
      >
        <!--  -->
      </v-sheet>
    </v-col>

    <v-col cols="12" sm="6">
      <v-sheet
        class="sheet"
        rounded="lg"

      >
        <v-row
          v-for="article in articles"
          :key="article.id"
        >
        <v-col>
          <v-card
            class="mx-auto"
            color="#ffffff"
            :to="{path : 'article/' + article.id}"
          >
            <v-card-title>
              <span class="title font-weight-light"></span>
            </v-card-title>

            <v-card-text class="headline font-weight-bold mb-0 pb-0">
              {{article.title}}
            </v-card-text>

            <v-card-subtitle class="pt-0">
              {{covertUpdateTime(article.updatedAt)}}
            </v-card-subtitle>

            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                    class="elevation-6"
                    alt=""
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monacoin.png/120px-Monacoin.png"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{article.user.name}}</v-list-item-title>
                </v-list-item-content>

                <v-row
                  align="center"
                  justify="end"
                >
                  <v-icon class="mr-1">
                    mdi-alpha-m-circle-outline
                  </v-icon>
                  <span class="subheading mr-2">{{article.sent_mona}} MONA</span>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col style="justify-content: center;">
          <v-pagination
            v-model="page"
            :length="pageLength"
            :total-visible="7"
            @input = "gotoPageN"
          ></v-pagination>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>

    <v-col
      cols="12"
      sm="3"
    >
      <v-sheet
        color="#f5f5f5"
        rounded="lg"
        min-height="140vh"
      >
        <!--  -->
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import {axiosInstance as Api} from '~/myModules/api'

export default {
   data() {
    return {
      articles: [],
      updated: '',
      page: 1,
      pageLength: 0
    }
  },
  async created() {
    this.page = this.$route.params.page == undefined ? 1 : Number(this.$route.params.page)
    const res = await Api.get('/', {
      params: {
        page: this.$route.params.page == undefined ? 1 : this.$route.params.page
      }
    })
    this.articles = res["data"]["articles"]
    const articlesCount = res["data"]["articlesCount"]
    this.pageLength = Math.ceil(articlesCount / 10)
  },
  methods: {
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    gotoPageN(page) {
      this.$router.push(`/${page}`)
    }
  },
}
</script>


<style scoped>
.sheet {
  background:rgba(161, 137, 137, 0);
}
</style>
