<template>
  <div>
    <h1>{{this.$route.params.article_id}}</h1>
  </div>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data(){
    return {

    }
  },
  async created() {
    const res = await Api.get('article', {
      params: {
        id: this.$route.params.article_id
      }
    })

    console.log(res)
  }
}
</script>
