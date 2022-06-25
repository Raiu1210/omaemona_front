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
              <v-img
                :src="getImagePathInContent(article['content'])"
                height="125px"
                class="pr-2 pt-2"
              >
                <v-chip v-if="isWithinWeek(article.createdAt)" class="float-right mx-2" color="primary" small>
                  new
                </v-chip>
                <v-chip class="float-right mt-0" color="success" small>
                  {{getCategory(article.category)}}
                </v-chip>
              </v-img>

              <v-card-subtitle class="pb-0 mb-0">
                <span>{{covertUpdateTime(article.createdAt)}}</span>
                <span class="ml-5">{{article.access}} views</span>
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
          <v-card
            class="mx-auto"
          >
            <v-toolbar
              color="blue-grey darken-1"
              dark
            >
              <v-toolbar-title>カテゴリ一覧</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list>
              <v-list-item-group color="primary" v-model="selectedCategoryId">
                <v-list-item
                  v-for="item in categories"
                  :key="item.id"
                  no-action
                >
                  <v-list-item-content @click="changeCategory(item.id)">
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
          <adsbygoogle
            ad-slot="7670670870"
          />
          <adsbygoogle
            ad-slot="9918194729"
          />
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
      articles: [],
      updated: '',
      page: 1,
      pageLength: 0,
      tabIndex: 0,
      destination: '',
      category: null,
      selectedCategoryId: null,
      gadStyle: {
        display:'inline-block',
        width:'300px',
        height:'250px'
      },
      categories: [],
    }
  },
  async fetch() {
    this.setDestination()

    const res = await Api.get(this.destination, {
      params: {
        page: this.$route.params.page == undefined ? 1 : this.$route.params.page,
        category: this.category
      }
    })
    this.articles = res["data"]["articles"]
    const articlesCount = res["data"]["articlesCount"]
    this.pageLength = Math.ceil(articlesCount / 10)
    this.categories = categoryUtils.getAllCategoriesObj()
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
      this.category = this.$route.query.category
      this.selectedCategoryId = this.categories.findIndex(({id}) => id == this.category)

      if (this.category) {
        this.destination = '/category'
      }
    },
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    gotoPageN(page) {
      if(this.category) {
        this.$router.push({ path: `/${page}`, query: {category: this.category} })
        return
      }
      if (this.destination == '/') {
        this.$router.push({ path: `${this.destination.slice(1)}/${page}` })
      } else {
        this.$router.push({ path: `${this.destination}/${page}` })
      }


    },
    changeCategory(categoryId) {
      this.$router.push({ path: '/', query: {category: categoryId} })
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
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
    gotoCategory(category) {
      this.category = category
      this.gotoPageN(this.page)
    },
    getImagePathInContent(content) {
      const result = content.match(/https:\/\/monaledge.com:8443.*\.jpg/)

      if(result) {
        return result[0]
      } else {
        return "https://gahag.net/img/201512/30s/gahag-0041342245-1.jpg"
      }
    }
  },
  watch: {
    $route(to, from) {
      if(this.category !== this.$route.query.category) {
        this.$fetch()
      }
    }
  }
}
</script>


<style scoped>
.sheet {
  background:rgba(245,245,245,0);
}

</style>
