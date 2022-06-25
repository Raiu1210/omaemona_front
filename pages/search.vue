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
                  <span>{{covertUpdateTime(article.createdAt)}}</span>
                  <span class="ml-5">{{article.access}} views</span>
                  <v-chip v-if="isWithinWeek(article.createdAt)" class="float-right mx-2" color="primary" small>
                    new
                  </v-chip>
                  <v-chip class="float-right mt-0" color="success" small>
                    {{getCategory(article.category)}}
                  </v-chip>
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
                        mdi-message-outline
                      </v-icon>
                      <span class="subheading mr-2">({{article.comments.length}})</span>
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

          <v-row>
            <v-col cols="6">
              <adsbygoogle
                ad-slot="1820228768"
              />
            </v-col>
            <v-col cols="6">
              <adsbygoogle
                ad-slot="9315575403"
              />
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
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import categoryUtils from '~/myModules/categoryUtils'

export default {
  data() {
    return {
      updated: '',
      page: 1,
      tabIndex: 0,
      destination: '',
    }
  },
  async asyncData({ params, query, $http }) {
    const res = await Api.get('searchArticle', {
      params: {
        q: query.q,
        page: query.page == undefined ? 1 : query.page
      }
    })
    const articlesCount = res["data"]["articlesCount"]

    return {
      articles: res["data"]["articles"],
      pageLength:  Math.ceil(articlesCount / 10)
    }
  },
  methods: {
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    gotoPageN(page) {
      this.$router.push({ path: '/search',
        query: {
          q: this.$route.query.q,
          page: page
        }
      })
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
    isWithinWeek(timeData) {
      const now = new Date()
      const createdAt = new Date(timeData)

      if(((now - createdAt) / 86400000) < 7) {
        return true
      }

      return false
    },
    getCategory(number) {
      return categoryUtils.translateNumberToCategory(number)
    },
  },
  async watchQuery(newQuery, oldQuery) {
    const res = await Api.get('searchArticle', {
      params: {
        q: newQuery.q,
        page: newQuery.page == undefined ? 1 : newQuery.page
      }
    })
    this.page = Number(newQuery.page)
    this.articles = res["data"]["articles"]
    const articlesCount = res["data"]["articlesCount"]
    this.pageLength = Math.ceil(articlesCount / 10)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },
}
</script>


<style scoped>
.sheet {
  background:rgba(245,245,245,0);
}

</style>
