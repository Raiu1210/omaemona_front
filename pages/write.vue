<template>
  <v-container class="editorView">
    <!-- alert -->
    <v-row>
      <v-col cols="12">
        <v-alert
          outlined
          type="success"
        >
          <div class="title">
            記事を書こう！
          </div>
          <div>良い記事を書いたらモナコインがもらえるかも！</div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- title field -->
    <v-row>
      <v-col cols="9">
        <v-text-field
          class="title_field"
          v-model="title"
          label="タイトル"
          height="50"
          outlined
          dense
        ></v-text-field>
      </v-col>

      <v-col
        cols="3"
      >
        <v-select
          label="モナコイン"
          :items="categories"
          item-text="name"
          item-value="id"
          v-model="selectedCategoryId"
          solo
        ></v-select>
      </v-col>
    </v-row>

    <svg v-show="false" ref="svgCard" viewBox="0 0 200 100">
      <rect x="0" y="0" width="200" height="100" fill="#fff" stroke="#ffffff" stroke-width="15"></rect>
      <!-- <path d="M-50 0 L0 0 L0 50 L50 0 Z" style="fill:#ff9800"/> -->
      <rect x="0" y="0" width="200" height="100" fill="#fff" stroke="#ff9800" stroke-width="15"></rect>
      <text x="50%" y="20%" font-size="6px" text-anchor="middle">MONALEDGE</text>
      <text x="55%" y="25%" font-size="3px" text-anchor="middle">モナレッジ</text>

      <text
        v-for="(title_part, index) in getTitlePart()"
        :key="index"
        x="50%" :y="lineHeight(index)" font-size="10px" text-anchor="middle"
      >
        {{title_part}}
      </text>
      <!-- <path d="M200 50 L150 100 L200 250 L250 200 Z" style="fill:#ff9800"/> -->
      <text x="90%" y="85%" font-size="6px" text-anchor="end">
        @{{authorName}}
      </text>
    </svg>

    <!-- editor : no-ssr -->
    <v-row>
      <v-col>
        <client-only>
          <mdEditor v-model="content" />
        </client-only>
      </v-col>
    </v-row>

    <!-- post button -->
    <!-- @todo v-dialogとか使えばもっとおしゃれになりそう -->
    <v-btn
      class="ma-2"
      color="success"
      @click="postContent"
    >
      投稿する
    </v-btn>

    <ShareDialog v-if="dialog" :title="title" />
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddressRegistered from '~/myModules/checkMyAddress'
import mdEditor from '~/components/mdEditor'
import ShareDialog from '~/components/ShareDialog'

const svg2imageData = (svgElement, successCallback, errorCallback) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.onload = () => {
    ctx.drawImage(image, 0, 0, 1200, 630)
    successCallback(canvas.toDataURL())
  }
  image.onerror = (e) => {
    errorCallback(e)
  }
  const svgData = new XMLSerializer().serializeToString(svgElement)
  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}


export default {
  data() {
    return {
      title: '',
      address: '',
      articleId: '',
      authorName: '',
      content: "# Markdownで記事を書く！",
      dialog: false,
      categories: [
        { id: 2, name:'暗号通貨' },
        { id: 3, name:'モナコイン' },
        { id: 4, name:'温泉' },
        { id: 5, name:'神社・お寺' },
        { id: 6, name:'趣味' },
        { id: 7, name:'日記' },
        { id: 8, name:'IT技術' },
        { id: 9, name:'ガジェット' },
        { id: 1, name:'その他' },
      ],
      selectedCategoryId: 3   // モナコイン
    };
  },
  async beforeMount() {
    let isMyAddressRegistered = await checkMyAddressRegistered()
    if (!isMyAddressRegistered['status']) {
      alert("記事を投稿するにはモナコインアドレスを登録する必要があります")
      this.$router.push('/signup')
    }
    this.authorName = isMyAddressRegistered['userInfo']['name']
  },
  methods: {
    async postContent() {
      if (this.title == '') {
        alert("タイトルが入力されていないよ！")
        return
      }
      if (this.content == '') {
        alert("記事が入力されていないよ！")
        return
      }
      // アドレスの確認
      const date = new Date()
      const now = date.getTime()

      // 投稿への確認
      const address = await window.mpurse.getAddress()
      const message = "I will post this article : " + now
      const signature = await window.mpurse.signMessage(message)

      var ogpRes = ''

      // post OGP image
      await svg2imageData(this.$refs.svgCard, async (data) => {
        const imageObj = {
          imageData: data
        }
        const res = await Api.post('/postOGP', imageObj)
        const postObj = {
          "title": this.title,
          "content": this.content,
          "address": address,
          "message": message,
          "signature": signature,
          "ogpPath": res['data']['ogpPath'],
          "category": this.selectedCategoryId
        }

        const result = await Api.post('/write', postObj)
        if (result["status"] == 201) {
          this.articleId = result["data"]["result"]["id"]
          this.$store.commit('setMyArticleId', result["data"]["result"]["id"])
          this.dialog = true
        }
      })
    },
    getTitlePart() {
      let lastClipped = 0
      let titleLines = []
      let lineLength = 0
      for (let i = 0; i < this.title.length; i++) {
        if(this.title[i].match(/[ -~]/)) {
          lineLength += 0.5
        } else {
          lineLength += 1
        }

        if(lineLength > 14) {
          titleLines.push(this.title.substring(lastClipped, i))
          lastClipped = i
          lineLength = 0
        }
      }

      if(lineLength > 0) {
        titleLines.push(this.title.substring(lastClipped, this.title.length))
      }

      return titleLines
    },
    lineHeight(index) {
      return String(45 + 10 * index) + "%"
    },
    fetchCategory (categoryText) {
      this.selectedCategoryId = this.categories[categoryText]
    }
  },
  components: {
    mdEditor,
    ShareDialog,
  }
};
</script>


<style scoped>
.editorView {
  width: 100%;
  height: 100%;
}

.title_field {
  background-color: white;
  height: 50px;
}
</style>
