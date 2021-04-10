<template>
  <div>
    <v-row
      v-for="article in articles"
      :key="article.id"
    >
      <v-col>
        <v-card
          class="mx-auto pb-6"
          color="#ffffff"
        >
          <nuxt-link style="text-decoration: none; color: inherit;" :to="`/article/${article.id}`">
            <v-card-subtitle class="pb-0 mb-0">
              {{covertUpdateTime(article.updatedAt)}}
            </v-card-subtitle>

            <v-card-title class="headline font-weight-bold mb-0 pb-0">
              {{article.title}}
            </v-card-title>

            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                    class="elevation-6"
                    alt=""
                    :src="iconImagePath(userInfo['icon_image_path'])"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{userInfo['name']}}</v-list-item-title>
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
            </v-card-actions>
          </nuxt-link>

          <!-- 編集&削除ボタン -->
          <v-row
            align="center"
            justify="end"
          >
            <!-- 編集ボタン -->
            <v-btn
              class="ma-2"
              color="success"
              @click="gotoEditPage(article.id)"
              v-if="editable"
            >
              編集
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>

            <!-- 削除ボタン -->
            <v-btn
              class="ma-2 mr-8"
              color="error"
              @click="deleteArticle(article.id)"
              v-if="editable"
            >
              削除
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import generateIconImagePath from '~/myModules/generateIconImagePath'

export default {
  props: {
    'userInfo': Object, require: true,
    'articles': Array, require: true,
    'editable': Boolean, require: true,
  },
  methods: {
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    iconImagePath(path) {
      return generateIconImagePath(path)
    },
    gotoEditPage(articleId) {
      this.$router.push(`/edit/${articleId}`)
    },
    async deleteArticle(articleId) {
      // 削除確認
      if(!confirm("この記事を削除しますか")) {
        return 0
      }
      // 削除のリクエスト
      const date = new Date()
      const now = date.getTime()
      const address = await window.mpurse.getAddress()
      const message = `I will delete article id ${articleId}:${now}`
      const signature = await window.mpurse.signMessage(message)

      const postObj = {
        articleId: articleId,
        address: address,
        message: message,
        signature: signature
      }
      const response = await Api.post('deleteArticle', postObj)
      if(response['data']['status'] == 0) {
        alert("記事を削除しました")
        this.$emit('initView')
      }
    },
  }
}
</script>
