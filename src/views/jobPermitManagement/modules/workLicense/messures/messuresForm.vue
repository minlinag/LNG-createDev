<template>
  <div class="layout-demo-basic">
    <a-row :span="24">
      <a-form-model :model="form" ref="form" :rules="rules">
        <a-divider orientation="left">特殊信息</a-divider>
        <a-row :gutter="24">
          <a-col
            :span="item.colSpan"
            v-for="(item, index) in measuresForm"
            :key="index"
          >
            <a-form-model-item
              :label="item.label"
              :label-col="colSpan(item.colSpan)"
            >
              <!--input输入框-->
              <a-input
                :placeholder="'请输入' + item.label"
                v-model="item.value"
                v-if="item.type == 'input'"
              />
              <!--多行输入框-->
              <a-textarea
                :placeholder="'请输入' + item.label"
                v-model="item.value"
                v-if="item.type == 'textArea'"
                :rows="1"
              />
              <!--下拉框-->
              <a-select
                v-if="item.type == 'select'"
                style="width: 100%"
                show-search
                :placeholder="'请选择' + item.label"
                option-filter-prop="children"
                v-model="item.value"
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(items, indexs) in item.data"
                  :value="items.value"
                  :key="indexs"
                >
                  {{ items.label }}
                </a-select-option>
              </a-select>
              <a-select
                v-if="item.type == 'selectAll'"
                mode="multiple"
                v-model="item.value"
                :placeholder="'请选择' + item.label"
                :default-value="item.value"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(items, indexs) in item.data"
                  :value="items.value"
                  :key="indexs"
                >
                  {{ items.label }}
                </a-select-option>
              </a-select>
              <a-radio-group
                v-model="item.value"
                v-if="item.type == 'radio'"
                :name="item.labelKey"
              >
                <a-radio
                  :value="items.value"
                  v-for="(items, indexs) in item.data"
                  :key="indexs"
                >
                  {{ items.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-row>
  </div>
</template>

<script>
//import someComponent from './someComponent'
export default {
  name: '',
  props: {
    measuresTitle: String,
    measuresForm: Array,
    default: () => {
      return []
    },
  },
  data() {
    return {
      labelCol: { style: 'width: 140px' },
      rowLabelCol: { style: 'width: 115px' },
      form: {},
      rules: {},
    }
  },
  watch: {
    measuresForm(val) {
      this.getRules(val)
    },
  },
  created() {
    this.getRules()
  },
  component: {
    //someComponent
  },
  methods: {
    getRules(val) {
      this.measuresForm.forEach((item) => {
        if (!item.value && item.type == 'select') {
          item.value = undefined
        }
        // if(item.type=="selectAll"){
            // console.log(item.value+'是我啊')
            // item.value=item.value.indexOf(',')>-1?item.value.join(","):[item.value]
        // }
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    colSpan(value) {
      switch (value) {
        case 12:
          return this.rowLabelCol
        // case 24:
        //     return this.labelCol
      }
    },
  },
}
</script>

<style scoped lang="less">
.layout-demo-basic {
  /deep/ .ant-form-item-control-wrapper {
    height: 40px !important;
  }
}
</style>
