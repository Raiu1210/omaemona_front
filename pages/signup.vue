<template>
  <div>
    <v-row align="center" justify="space-around">
      <v-card
        class="mt-10"
        elevation="2"
        outlined
        shaped
        tile
      >
        <v-card-title class="headline">サインアップするのに必要なこと</v-card-title>
        <v-card-subtitle>mpurseのインストール</v-card-subtitle>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <div class="body-1 mb-1">このアプリではMONACOINを受け取ったり、送ったりするのにmpurseというものを使います</div>
          <div class="body-1 mb-1">mpurseはchromeとfirefoxで利用可能な拡張機能です。</div>
          <div class="body-1 mb-1">記事を読むだけならmpurseは不要ですが、記事を投稿したり、好きな記事にMONAを送るためにはmpurseが便利です</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" href="https://chrome.google.com/webstore/detail/mpurse/ljkohnccmlcpleonoiabgfggnhpkihaa">Chromeにインストール</v-btn>
          <v-btn color="info" href="https://addons.mozilla.org/ja/firefox/addon/mpchain_mpurse/">FireFoxにインストール</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-row align="center" justify="space-around">
      <v-col
          cols="12"
          md="4"
        >
      <v-text-field
        background-color="white"
        height="50"
        ref="name_form"
        v-model="name"
        :rules="nameRules"
        :counter="20"
        label="名前"
        required
      ></v-text-field>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="space-around"
    >
      <v-btn
        tile
        color="success"
        class="mt-8"
        @click="signup"
      >
        <v-icon left>
          mdi-pencil
        </v-icon>
        signupする
      </v-btn>
    </v-row>
  </div>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data() {
    return {
      name: '',
      isValid : true ,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 20 || 'Name must be less than 10 characters',
      ],
    }
  },
  methods: {
    async signup() {
      if(!this.$refs["name_form"].validate()) {
        alert("名前は20文字以内で入力してください")
      }

      const date = new Date()
      const now = date.getTime();

      const address = await window.mpurse.getAddress()
      const message = "I am " + this.name + ", register at : " + now
      const signature = await window.mpurse.signMessage(message)

      const postItem = {
        name: this.name,
        address: address,
        message: message,
        signature: signature
      }

      const response = await Api.post('/signup', postItem)
      console.log(response)
    }
  }
}
</script>
