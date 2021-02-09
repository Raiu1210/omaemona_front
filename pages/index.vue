<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="8"
      v-for="article in articles"
      :key="article.id"
    >
      <v-card
        class="mx-auto"
        color="#26c6da"
        :to="{path : 'write'}"
        dark
      >
        <v-card-title>
          <span class="title font-weight-light"></span>
        </v-card-title>

        <v-card-text class="headline font-weight-bold">
          {{article.title}}
        </v-card-text>

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

            <!-- <v-row
              align="center"
              justify="end"
            >
              <v-icon class="mr-1">
                mdi-heart
              </v-icon>
              <span class="subheading mr-2">256</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">
                mdi-share-variant
              </v-icon>
              <span class="subheading">45</span>
            </v-row> -->
          </v-list-item>
        </v-card-actions>
      </v-card>
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
    }
  },
  async created() {
    const response = await Api.get('/')
    this.articles = response['data']
  },
  beforeMount() {
    checkMyAddress()
  },
  computed: {

  },
  components: {

  }
}
</script>
