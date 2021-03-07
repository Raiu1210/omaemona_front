<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card class="pa-5">
        <v-card-title>
          <span class="headline">プロフィール編集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-text-field
                  label="名前"
                  v-model="name"
                  :counter="20"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <span class="ml-3">アバター画像</span>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <img-inputer
                  v-model="file"
                  theme="light"
                  size="large"
                  placeholder="ファイルをここにドラッグする"
                  bottom-text="クリックで画像を再選択"
                />
              </v-col>
            </v-row>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeEditView"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateMyProfile"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>



<script>
import axios from 'axios'
import {axiosInstance as Api} from '~/myModules/api'
import {imageUploader as imageUploader} from '~/myModules/imageUploader'
import ImgInputer from 'vue-img-inputer'
import 'vue-img-inputer/dist/index.css'

export default {
  props:{
    'name': {
      type: String,
    },
    'icon_image_path': {
      type: String,
    }
  },
  data() {
    return {
      dialog: true,
      file: null,
      isValid : true ,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 20 || 'Name must be less than 20 characters',
      ],
    }
  },
  methods: {
    closeEditView() {
      this.$emit('closeEditView')
    },
    async updateMyProfile() {
      let icon_image_path = this.icon_image_path
      // アドレスの確認
      const date = new Date()
      const now = date.getTime()

      // 投稿への確認
      const address = await window.mpurse.getAddress()
      const message = "I will update my profile : " + now
      const signature = await window.mpurse.signMessage(message)

      const env = process.env.NODE_ENV || 'development'
      let url = 'https://monaledge.com:8443'
      if(env == 'development') {
        url = 'http://localhost:3333'
      }

      if (this.file != null) {
        var formdata = new FormData()
        formdata.append('image', this.file);

        // if image input exists, upload and get image path
        const res = await imageUploader.post('/addImage', formdata)
        const path = res.data.path
        const imagePath = path.slice(6)
        icon_image_path = url + imagePath
      }


      // update my profile
      const postObj = {
        address: address,
        message: message,
        signature: signature,
        name: this.name,
        iconImagePath: icon_image_path
      }
      console.log(postObj)
      await Api.post('updateProfile', postObj)
      location.reload()
    }
  },
  components: {
    ImgInputer
  }
}
</script>
