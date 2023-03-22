<template>
  <a-button type="primary btn_primary"
            @click.stop="Export()">
    <svg-icon class="button_svg"
              icon-class="export-icon" />
    {{Text}}
  </a-button>
</template>
<script>
import utils from "@/utils/url";
export default {
  props: {
    url: String,
    params: Object,
    Text: {
      type: String,
      default: "导出",
    },
  },
  data() {
    return {};
  },
  methods: {
    Export() {
      let index = 0;
      let Strprames = "";
      for (let i in this.params) {
        index > 0
          ? (Strprames += "&" + i + "=" + this.params[i])
          : (Strprames += i + "=" + this.params[i]);
        index++;
      }
      window.location.href = utils.baseURL + this.url + "?" + Strprames;
    },
  },
  mounted() {},
};
</script>