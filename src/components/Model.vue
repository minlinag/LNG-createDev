<template>
  <a-modal
    title="Title"
    :width="width"
    :title="modelConfig.title"
    :cancelText="modelConfig.cancelText"
    :footer="modelConfig.footer"
    :visible="minValue"
    @ok="handleOk"
    @cancel="handleCancel"
    class="modal_wrapper"
    :maskClosable="false"
  >
    <slot></slot>
  </a-modal>
</template>
<script>
export default {
  props: {
    value: {},
    modelConfig: {
      type: Object,
    },
    width: {
      type: String,
      default: "1000px",
    },
  },
  data() {
    return {
      minValue: this.value,
    };
  },
  mounted() {
    console.log(this.modelConfig, 123123);
  },
  watch: {
    value(newData) {
      this.minValue = newData;
    },
  },
  methods: {
    handleOk() {
      this.$emit("handleOk");
    },
    handleCancel() {
      this.$emit("input", (this.minValue = false));
    },
  },
};
</script>
<style scoped>
.aaaaa {
  width: 950px;
}
.modal_wrapper ::v-deep .ant-modal-content {
  margin-top: -2rem;
  max-width: 1198px;
  width: 100%;
}
</style>

<!-- 

            :attrs="modelConfig.modelConfig ? modelConfig.modelConfig : ''"
            :prefixCls="modelConfig.prefixCls ? modelConfig.prefixCls : ''"
            :wrapClassName="modelConfig.wrapClassName ? modelConfig.wrapClassName : ''"
            :closable="modelConfig.closable ? modelConfig.closable : ''"
            :title="modelConfig.title ? modelConfig.title : ''"
            :transitionName="modelConfig.transitionName ? modelConfig.transitionName : ''"
            :footer="modelConfig.footer ? modelConfig.footer : '' "
            :maskTransitionName="modelConfig.maskTransitionName ? modelConfig.maskTransitionName : ''"
            :mask="modelConfig.mask ? modelConfig.mask : ''"
            :maskClosable="modelConfig.maskClosable ? modelConfig.maskClosable : ''"
            :maskStyle="modelConfig.maskStyle ? modelConfig.maskStyle : {}"
            :width="modelConfig.width ? modelConfig.widt : ''"
            :zIndex="modelConfig.zIndex ? modelConfig.zIndex : 1000"
            :keyboard="modelConfig.keyboard ? modelConfig.keyboard : ''"
            :centered="modelConfig.centered ? modelConfig.centered : ''"

 -->
