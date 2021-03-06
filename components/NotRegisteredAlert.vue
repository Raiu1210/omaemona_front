<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          アドレスが見つかりませんでした
        </v-card-title>

        <v-card-text class="pa-5">
          マイページを利用するにはサインアップが必要です。<br />
          このアドレスは登録されていないか、あなたが登録したアドレスとは別のアドレスの可能性があります
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="gotoHome"
          >
            ホーム
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="gotoSignup"
          >
            サインアップ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      dialog: true,
    }
  },
  methods: {
    gotoHome() {
      this.dialog = false
      this.$router.push('/')
    },
    gotoSignup() {
      this.dialog = false
      this.$router.push('/signup')
    }
  }
}
</script>
