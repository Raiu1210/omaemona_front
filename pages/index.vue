<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div v-html="sample"></div>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

import checkMyAddress from '~/myModules/checkMyAddress'
import sample from './README.md'

export default {
  beforeMount() {
    checkMyAddress()
  },
  computed: {
    sample() {
      return sample
    }
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
