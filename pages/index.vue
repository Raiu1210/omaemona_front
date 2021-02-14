<template>
  <v-row justify="center" align="center">
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

    <v-col cols="12" sm="6">
      <v-sheet
        class="sheet"
        rounded="lg"
        min-height="140vh"
        max-height="140vh"
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
import checkMyAddress from '~/myModules/checkMyAddress'
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data() {
    return {
      articles: [],
      updated: ''
    }
  },
  async created() {
    const res = await Api.get('/')
    this.articles = res["data"]
  },
  beforeMount() {
    checkMyAddress()
  },
  methods: {
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + timeObj.getMonth() + '月' + timeObj.getDate() + '日'
    }
  },
}
</script>


<style scoped>
.sheet {
  background:rgba(245,245,245,0);
}
</style>
