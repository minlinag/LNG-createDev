<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        :value="value"
        @change="handleChange"
        type="textarea"
        :id="index"
        :autoSize="{ minRows: 2, maxRows: 6 }"
      /><a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      <p>{{ value || " " }}</p>
      <a-icon
        type="edit"
        class="editable-cell-icon"
        @click="edit"
        v-if="editShow"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "editableCell",
  props: {
    text: String,
    index: String,
    editShow: {
      recode: {
        type: Boolean,
        default: () => {
          return true;
        },
      },
    }
  },
  data() {
    return {
      value: this.text,
      editable: false,

    };
  },
  watch: {
    text: {
      handler(vla) {
        this.value = vla
      }
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
}
</script>
<style lang="less" scoped>
.editable-cell-input-wrapper {
  display: flex;
  align-items: center;
}
.editable-cell-text-wrapper {
  display: flex;
  align-items: center;
  p {
    max-height: 115px;
    overflow: auto;
    display: inline-block;
    margin-bottom: 0;
    font-size: 12px;
  }
}
</style>
<style lang="less">
.from-style .multi_line .ant-form-item-control {
  line-height: 28px;
  .ant-input {
    height: 114px;
  }
}
.from-style .multi_line .ant-table-tbody > tr > td {
  overflow: auto;
  white-space: initial;
}
</style>