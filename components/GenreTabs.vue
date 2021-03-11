<template>
  <v-sheet elevation="6" class="mb-5">
    <v-tabs
      class="tabs"
      fixed-tabs
      v-model="tabIndex"
    >
      <v-tab
        v-for="genre in genres"
        :key="genre.apiDestination"
        :to="genre.apiDestination"
      >
        {{genre.name}}
      </v-tab>
    </v-tabs>
  </v-sheet>
</template>


<script>
export default {
  data() {
    return {
      genres: [
        {name: '新着', apiDestination: '/'},
        {name: '人気', apiDestination: '/popular'},
        {name: '投げ銭', apiDestination: '/tipped'}
      ],
      tabIndex: 1,
      apiDestination: '/',
    }
  },
  mounted() {
    if (this.$route.path.match(/popular/)) {
      this.tabIndex = 1
    } else if (this.$route.path.match(/tipped/)) {
      this.tabIndex = 2
    } else {
      this.tabIndex = 0
    }
  }

}
</script>
