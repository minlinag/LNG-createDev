<template>
  <div class="step">
    <a-steps :current="stepConfiguration.stepProgress">
      <a-popover
        slot="progressDot"
        slot-scope="{ index, prefixCls }"
        :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode;
          }
        "
      >
        <template slot="content">
          <span>step {{ index + 1 }}</span>
        </template>
        <span :class="`${prefixCls}-icon-dot`" />
      </a-popover>
      <a-step v-for="(item, index) in stepConfiguration.stepList" :key="index">
        <template slot="title">
          {{ item.title }}
        </template>
        <div slot="description" class="descriptionBox">
          <div>{{ item.name }}</div>
          <div>{{ item.dataTime || "待审批" }}</div>
          <div style="margin-top: 10px" v-if="item.children">
            <div v-for="(childrenItem, index) in item.children" :key="index">
              <div class="ant-steps-item-title">{{ childrenItem.title }}</div>
              <div>{{ childrenItem.name }}</div>
              <div>{{ childrenItem.dataTime || "待审批" }}</div>
            </div>
          </div>
        </div>
      </a-step>
    </a-steps>
  </div>
</template>
<script >
export default {
  name: "steps",
  props: {
    stepConfiguration: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style scoped>
.step {
  margin-bottom: 30px;
}
>>> .ant-popover-inner-content {
  width: 100px !important;
  text-align: center;
}
</style>