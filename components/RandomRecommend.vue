<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet
          class="sheet pa-3"
          rounded="lg"
        >
          <v-row class="px-3">
            <h2>あわせて読みたい</h2>
          </v-row>
          <v-row
            v-for="article in articles"
            :key="article.id"
          >
            <v-col>
              <v-card
                class="mx-auto mb-2"
                color="#ffffff"
                :to="{path : '/article/' + article.id}"
              >
                <v-card-text class="subtitle-1 font-weight-bold mb-0 pb-0">
                  {{article.title}}
                </v-card-text>

                <!-- <v-card-actions>
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
                </v-card-actions> -->
              </v-card>
            </v-col>
          </v-row>
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
      articles: []
    }
  },
  async created() {
    const res = await Api.get('/random')
    this.articles = res['data']['result']
  }
}
</script>
