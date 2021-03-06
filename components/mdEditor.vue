<template>
  <mavon-editor
    class="editor"
    fontSize="18px"
    :toolbars="markdownOption"
    language="ja"
    v-model="content"
    @imgAdd="$imgAdd"
    ref=md
  />
</template>


<script>
import {mavonEditor} from 'mavon-editor'
import axios from 'axios'
import {axiosInstance as Api} from '~/myModules/api'

export default {
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      markdownOption: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        fullscreen: true,
        readmodel: true,
        htmlcode: true,
        help: true,
      },
    }
  },
  methods: {
    $imgAdd(pos, $file){
      const env = process.env.NODE_ENV || 'development'
      let url = 'https://monaledge.com:8443'
      if(env == 'development') {
        url = 'http://localhost:3333'
      }

      // step 1. upload image to server.
      var formdata = new FormData();
      formdata.append('image', $file);
      axios({
        url: `${url}/addImage`,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => {
        // step 2. replace url ![...](./0) -> ![...](url)
        const path = res.data.path
        const imagePath = path.slice(6)
        this.$refs.md.$img2Url(pos, url+imagePath)
      })
    },
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  }
}
</script>


<style scoped>
.editor {
  z-index: 1
}
</style>
