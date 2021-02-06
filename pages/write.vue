<template>
  <div class="editorView">
    <no-ssr>
      <mavon-editor :toolbars="markdownOption" :language="'ja'" v-model="handbook"/>
    </no-ssr>

    <!-- post button -->
    <v-btn
      class="ma-2"
      :loading="loading2"
      :disabled="loading2"
      color="success"
      @click="loader = 'loading2'"
    >
      Custom Loader
    </v-btn>
  </div>
</template>


<script>
export default {
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
      handbook: "#### Markdown"
    };
  }
};
</script>


<style scoped>
.editorView {
  width: 100%;
  height: 100%;
}
</style>
