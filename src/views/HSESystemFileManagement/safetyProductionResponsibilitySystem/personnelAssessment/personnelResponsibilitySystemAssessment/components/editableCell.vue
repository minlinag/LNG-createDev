<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        :value="value"
        @change="handleChange"
        :id="index + '.version'"
      /><a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || " " }}
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
    index: Number,
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