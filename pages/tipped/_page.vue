<template>
  <div>
    <GenreTabs />
    <ArticleTimeline />
  </div>
</template>

<script>
import {axiosInstance as Api} from '~/myModules/api'
import GenreTabs from '~/components/GenreTabs'
import ArticleTimeline from '~/components/ArticleTimeline'

export default {
  components: {
    GenreTabs,
    ArticleTimeline
  }
}
</script>
