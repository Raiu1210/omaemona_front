<template>
  <v-container>
    <!-- ad area -->
    <v-row>
      <v-col cols="6">
        <adsbygoogle
          ad-slot="8949509208"
        />
      </v-col>
      <v-col cols="6">
        <adsbygoogle
          ad-slot="9879447495"
        />
      </v-col>
    </v-row>

    <!-- contents area -->
    <!-- <v-row justify="center">
      <v-col align="center" cols="10">
        <v-img
          width="30%"
          src="/gacha.png"
        ></v-img>
      </v-col>
    </v-row> -->

    <!-- buttons area -->
    <v-row justify="center" class="mb-8">
      <v-col align="center" cols="6">
        <v-btn
          height="130px"
          color="primary"
          elevation="3"
          x-large
          @click="freeGacha()"
        >無料ガチャを回す</v-btn>
      </v-col>

      <v-col align="center" cols="6">
        <v-btn
          height="130px"
          color="error"
          elevation="3"
          x-large
          @click="chargedGacha()"
        >有料ガチャ<br>(0.04545MONA)<br>「ち」と「ん」の<br>出る確率が10倍！</v-btn>
      </v-col>
    </v-row>

    <!-- result area -->
    <svg ref="svgCard" viewBox="0 0 200 100">
      <rect x="0" y="0" width="200" height="100" fill="#fff" stroke="#ffffff" stroke-width="15"></rect>
      <!-- <path d="M-50 0 L0 0 L0 50 L50 0 Z" style="fill:#ff9800"/> -->
      <rect x="0" y="0" width="200" height="100" fill="#fff" stroke="#ff9800" stroke-width="15"></rect>
      <text x="50%" y="20%" font-size="6px" text-anchor="middle">MONALEDGE モナレッジ</text>
      <text x="55%" y="25%" font-size="3px" text-anchor="middle"></text>

      <text x="35%" y="50%" font-size="10px" text-anchor="middle">
        {{c1}}
      </text>
      <text x="45%" y="50%" font-size="10px" text-anchor="middle">
        {{c2}}
      </text>
      <text x="55%" y="50%" font-size="10px" text-anchor="middle">
        {{c3}}
      </text>
      <text x="65%" y="50%" font-size="10px" text-anchor="middle">
        {{c4}}
      </text>
      <!-- <path d="M200 50 L150 100 L200 250 L250 200 Z" style="fill:#ff9800"/> -->
      <text x="90%" y="85%" font-size="6px" text-anchor="end">
        もじガチャ
      </text>
    </svg>

    <!-- <v-btn
      class="ma-10"
      fab
      dark
      color="blue"
      @click="share($route.params.article_id, 'twitter')"
      v-on="{ ...tooltip2 }"
    >
      <v-icon dark>
        mdi-twitter
      </v-icon>
    </v-btn> -->


    <!-- ad area2 -->
    <v-row>
      <v-col cols="6">
        <adsbygoogle
          ad-slot="8949509208"
        />
      </v-col>
      <v-col cols="6">
        <adsbygoogle
          ad-slot="9879447495"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'

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
      kana: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      cKana: "あいうえおかきくけこさしすせそたちちちちちちちちちちちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんんんんんんんんんんん"
    }
  },
  created() {
    const r1 = Math.floor( Math.random() * 46 )
    const r2 = Math.floor( Math.random() * 46 )
    const r3 = Math.floor( Math.random() * 46 )
    const r4 = Math.floor( Math.random() * 46 )

    this.c1 = this.kana.slice(r1, r1+1)
    this.c2 = this.kana.slice(r2, r2+1)
    this.c3 = this.kana.slice(r3, r3+1)
    this.c4 = this.kana.slice(r4, r4+1)

  },
  methods: {
    freeGacha() {
      location.reload()
    },
    async chargedGacha() {
      try {
        const txHash = await window.mpurse.sendAsset(
          'M9hY5XcC7MSD54DfqcEojiKm9QMgXeQhGK',
          'MONA',
          0.04545,
          'plain',
          'LGTM'
        )
        console.log(txHash)
        const r1 = Math.floor( Math.random() * 66 )
        const r2 = Math.floor( Math.random() * 66 )
        const r3 = Math.floor( Math.random() * 66 )
        const r4 = Math.floor( Math.random() * 66 )

        this.c1 = this.cKana.slice(r1, r1+1)
        this.c2 = this.cKana.slice(r2, r2+1)
        this.c3 = this.cKana.slice(r3, r3+1)
        this.c4 = this.cKana.slice(r4, r4+1)
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
