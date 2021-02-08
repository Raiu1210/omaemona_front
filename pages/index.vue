<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <!-- <div v-html="sample"></div> -->
      {{articles}}
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
    this.articles = await Api.get('/')
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
