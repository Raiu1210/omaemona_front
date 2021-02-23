<template>
  <mavon-editor
    fontSize="18px"
    :toolbars="markdownOption"
    :language="'ja'"
    v-model="content"
  />
</template>


<script>
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
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
}
</script>
