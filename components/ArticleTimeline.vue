<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="1"
      >
        <v-sheet
          color="#f5f5f5"
          rounded="lg"
          min-height="2vh"
        >
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="8">
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
              :to="{path : '/article/' + article.id}"
            >
              <v-card-subtitle class="pb-0 mb-0">
                {{covertUpdateTime(article.updatedAt)}}
              </v-card-subtitle>

              <v-card-title class="pa-0 mt-2">
                <span class="title font-weight-light"></span>
              </v-card-title>

              <v-card-text class="headline font-weight-bold mb-0 pb-0">
                {{article.title}}
              </v-card-text>

              <v-card-actions>
                <v-list-item class="grow">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      alt=""
                      :src="iconImagePath(article.user.icon_image_path)"
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
                    <span class="subheading mr-2">{{article.sent_mona.toFixed(8)}} MONA</span>
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
          min-height="600px"
        >
          <adsbygoogle
            ad-slot="timeline-ad1"
            ad-format=""
            :ad-style="gadStyle"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data() {
    return {
      articles: [],
      updated: '',
      page: 1,
      pageLength: 0,
      tabIndex: 0,
      destination: '',
      gadStyle: {
        display:'inline-block',
        width:'300px',
        height:'250px'
      }
    }
  },
  async fetch() {
    this.setDestination()

    const res = await Api.get(this.destination, {
      params: {
        page: this.$route.params.page == undefined ? 1 : this.$route.params.page
      }
    })
    this.articles = res["data"]["articles"]
    const articlesCount = res["data"]["articlesCount"]
    this.pageLength = Math.ceil(articlesCount / 10)
  },
  methods: {
    setDestination() {
      if (this.$route.path.match(/popular/)) {
        this.destination = '/popular'
      } else if (this.$route.path.match(/tipped/)) {
        this.destination = '/tipped'
      } else {
        this.destination = '/'
      }
      this.page = this.$route.params.page == undefined ? 1 : Number(this.$route.params.page)
    },
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    gotoPageN(page) {
      if (this.destination == '/') {
        this.$router.push({ path: `${this.destination.slice(1)}/${page}` })
      } else {
        this.$router.push({ path: `${this.destination}/${page}` })
      }
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
    }
  },
}
</script>


<style scoped>
.sheet {
  background:rgba(245,245,245,0);
}

</style>
