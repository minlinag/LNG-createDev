<!-- eslint-disable vue/no-mutating-props -->
<!--        Config: {
                otherConfigurations: [
                    {
                        type: 'otherTypes', //组件类型 目前指出 input || select || 其他类型 || 按钮类型
                        label: '设备名称', //展示名称
                        slotScoped: 'table', //插槽
                    },
                    {
                        type: 'btn',
                        label: '保存',
                        btnType:'primary',  //button按钮 （根据 vue-ant-design 按钮格式进行操作）
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        emit:'save' //传值内容 拿到当前所有数据包装好的 （通过emit 进行传输 父组件中使用 @save）
                    },
                    {
                        type: 'btn',
                        label: '删除',
                        btnType:'Delate',  //button按钮 （根据 vue-ant-design 按钮格式进行操作）
                        disabled: true, //是否禁用 true 是禁用 默认是false
                        emit:'Delate' //传值内容 拿到当前所有数据包装好的
                    }
                ],
                formDataList: [
                    {
                        type: 'input', //组件类型 目前指出 input || select
                        label: '设备名称', //展示名称
                        formKey: 'name', //form 定义的 key (必须唯一 || 必须传入)
                        value: '', // 默认值为空字符串 // v-model 绑定值
                        placeholder: '请输入', //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: '100px' } }, //组件样式 form-item
                        options: { // 暂时开发状态
                            multiple: true,
                        },
                    },
                ],
            },
 -->
<template>
  <a-col :span="itemConfig && itemConfig.colSpan">
    <a-form-model-item
      class="formInDemo"
      :label-col="itemConfig && itemConfig.labelStyle"
      :label="itemConfig && itemConfig.label"
      :prop="itemConfig.formKey"
      :rules="itemConfig.options.vDecorator && itemConfig.options.vDecorator"
      v-if="itemConfig || componentShow"
    >
      <div class="aFormItemContetnStyle">
        <div v-if="itemConfig && itemConfig.type == 'input'">
          <a-input
            @focus="$emit('focus', itemCopyConfig)"
            :style="itemConfig.selectInputStyle"
            :disabled="itemConfig && itemConfig.disabled"
            :placeholder="itemConfig && itemConfig.placeholder"
            @change="selectItemConfigChange"
            :addon-after="itemConfig.addonAfter"
            v-model="itemCopyConfig.value"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'inputNumber'">
          <a-input-number
            id="inputNumber"
            @focus="$emit('focus', itemCopyConfig)"
            :style="itemConfig.selectInputStyle"
            :disabled="itemConfig && itemConfig.disabled"
            :placeholder="itemConfig && itemConfig.placeholder"
            @change="selectItemConfigChange"
            v-model="itemCopyConfig.value"
            :min="itemCopyConfig.mix"
            :max="itemCopyConfig.max"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'textArea'">
          <!--//刘豪东添加循环项 多行输入框 textArea-->
          <a-textarea
            @focus="$emit('focus', itemCopyConfig)"
            :style="itemConfig.selectInputStyle"
            :disabled="itemConfig && itemConfig.disabled"
            :placeholder="itemConfig && itemConfig.placeholder"
            @change="selectItemConfigChange"
            v-model="itemCopyConfig.value"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          />
        </div>
        <div
          class="selectContent"
          v-if="itemConfig && itemConfig.type == 'select'"
        >
          <a-select
            @change="selectItemConfigChange($event)"
            :disabled="itemConfig && itemConfig.disabled"
            :placeholder="itemConfig && itemConfig.placeholder"
            :showSearch="itemConfig && itemConfig.showSearch"
            :option-filter-prop="itemConfig && itemConfig.optionFilterProp"
            v-model="itemCopyConfig.value"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :mode="itemConfig.mode"
          >
            <a-select-option
              v-for="(item, index) in itemConfig.optionData"
              :key="index"
              :value="item.value"
              >{{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div v-if="itemConfig && itemConfig.type == 'radio'">
          <a-checkbox v-model="itemConfig.value" />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'datePicker'">
          <a-date-picker
            :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :format="itemConfig.format"
            :valueFormat="itemConfig.format"
            v-model="itemCopyConfig.value"
            :placeholder="itemConfig && itemConfig.placeholder"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'datePickerdis'">
          <a-date-picker
            :disabled-date="disableEndTime"
            :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :format="itemConfig.format"
            :valueFormat="itemConfig.format"
            v-model="itemCopyConfig.value"
            :placeholder="itemConfig && itemConfig.placeholder"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'dateTimePicker'">
          <!--//张晓阳添加循环项 日期时间选择器 dateTimePicker-->
          <a-date-picker
            show-time
            :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :format="itemConfig.format"
            :valueFormat="itemConfig.format"
            v-model="itemCopyConfig.value"
            :allowClear="itemCopyConfig.allowClear"
            :placeholder="itemConfig && itemConfig.placeholder"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'dateMonthPicker'">
          <a-month-picker
            :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :format="itemConfig.format"
            :valueFormat="itemConfig.format"
            v-model="itemConfig.value"
            :placeholder="itemConfig && itemConfig.placeholder"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'disabledDateMonthPicker'">
          <a-month-picker
            :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :format="itemConfig.format"
            :valueFormat="itemConfig.format"
            v-model="itemConfig.value"
            :placeholder="itemConfig && itemConfig.placeholder"
            :disabled-date="itemConfig.disabledDate"
            :defaultPickerValue="itemConfig.defaultPickerValue"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'dateRangePicker'">
          <a-range-picker
            :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle"
            :valueFormat="itemConfig.format"
            v-model="itemConfig.value"
          />
        </div>
        <div v-if="itemConfig && itemConfig.type == 'btnInput'">
          <div style="display: flex">
            <a-input
              :disabled="itemConfig && itemConfig.disabled"
              style="
                width: 115px;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="
                itemConfig.selectInputStyle && itemConfig.selectInputStyle
              "
              :valueFormat="itemConfig.format"
              v-model="itemConfig.value"
              :placeholder="itemConfig && itemConfig.placeholder"
              :enter-button="itemConfig.enterText"
            />
            <a-button
              class="btn-style"
              type="primary"
              @click="$emit('onSearch', itemConfig)"
            >
              {{ itemConfig.enterText }}
            </a-button>
          </div>
          <!-- <a-input-search :disabled="itemConfig && itemConfig.disabled"
            :style="itemConfig.selectInputStyle && itemConfig.selectInputStyle" :valueFormat="itemConfig.format"
            v-model="itemConfig.value" :placeholder="itemConfig && itemConfig.placeholder"
            :enter-button="itemConfig.enterText" size="default" @search="" /> -->
        </div>

        <div v-if="itemConfig && itemConfig.type == 'btnSelect'">
          <div style="display: flex">
            <a-input
              :disabled="itemConfig && itemConfig.disabled"
              :style="
                itemConfig.selectInputStyle && itemConfig.selectInputStyle
              "
              :valueFormat="itemConfig.format"
              v-model="itemConfig.value"
              :placeholder="itemConfig && itemConfig.placeholder"
              :enter-button="itemConfig.enterText"
            />
            <a-button type="primary" @click="$emit('onSearch', itemConfig)">
              {{ itemConfig.enterText }}
            </a-button>
          </div>
        </div>
      </div>
    </a-form-model-item>
  </a-col>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    itemConfig: Object,
    config: Array,
    empty: Boolean,
    indexConfig: Number,
  },
  data() {
    // emptyList(){
    //   if(){}
    // }

    return {
      itemCopyConfig: {},
    };
  },
  computed: {
    // itemCopyConfig: {
    //   get() {
    //     let newItem = this.itemConfig
    //     return newItem
    //   },
    //   set() {},
    // },
    componentShow() {
      const vIfArr = this.itemConfig ? this.itemConfig.options.vIf : false;
      if (!vIfArr) return true;
      const relationArr = this.config.filter((config) =>
        vIfArr.find((vIf) => vIf.relationKey === config.formKey)
      );
      for (const relationItem of relationArr) {
        const vIfItem = vIfArr.find(
          (_) => _.relationKey === relationItem.formKey
        );
        // 这里就是判断 联动的表单值 是否不满足 可以显示 的条件，不满足则不显示
        if (relationItem.value !== vIfItem.value) return false;
      }
      return true;
    },
  },
  watch: {
    "itemCopyConfig.value": {
      handler(newVal, oldVal) {
        if (newVal != "" && newVal != null) {
          if (Array.isArray(newVal) && newVal[0] != "") {
            switch (newVal.length) {
              case 1:
                if (newVal[0] != oldVal[0]) {
                  return false;
                }
                break;
              case 2:
                if (newVal[0] !== null && newVal[1] !== null) {
                  if (newVal[0] != oldVal[0] || newVal[1] != oldVal[1]) {
                    this.$emit(
                      "handleChange",
                      this.itemCopyConfig,
                      this.indexConfig
                    );
                  }
                }
                break;
            }
          } else {
            if (newVal !== oldVal) {
              this.$emit("handleChange", this.itemCopyConfig, this.indexConfig);
            }
          }
        }
      },
      immediate: true,
    },
    itemConfig: {
      handler(newVal) {
        this.itemCopyConfig = this.$lodash.cloneDeep(newVal);
      },
      deep: true,
      // immediate: true,
    },
  },
  // activated() {
  //
  // },
  created() {
    this.itemCopyConfig = this.$lodash.cloneDeep(this.itemConfig);
    console.log(this.itemConfig)
  },
  methods: {
    selectItemConfigChange() {
      this.$emit("handleChange", this.itemCopyConfig, this.indexConfig);
    },
    disableEndTime(current) {
      // return current && current > moment().endOf("day");//当前日期之后不能选择
      // return current && current < moment().endOf("day");//当前日期之前不能选择（含当前日）
      return current && current < moment().subtract(1, "days");//当前日期之前不能选择（不含当前日）

      //只能选择日期区间内 dates格式为[“2022-08-01","2022-09-30”]
      let beginDay = dates[0];
      let endDay = dates[1];
      return current && current < moment(beginDay).endOf("day") || current > moment(endDay).endOf("day");
    },
  },
};
</script>
<style scoped lang="less">
.btn-style {
  margin-left: 0 !important;
  height: 34px;
}
.aFormItemContetnStyle {
  // margin-bottom: 20px;
}
.ant-calendar-picker-input.ant-input {
  width: 180px;
}
/deep/.ant-btn {
  border-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.ant-input-number{
  width: 180px;
}
</style>
