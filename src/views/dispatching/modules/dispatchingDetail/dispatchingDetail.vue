<template>
  <div class="dispatching-content">
    <a-row>
      <!-- <a-card :bordered="false"> -->
      <a-form-model ref="form" :model="measuresObj" :rules="rules">
        <a-row :gutter="24">
          <a-col
                  :span="item.colSpan"
                  v-for="(item, index) in measuresForm"
                  :key="index"
          >
            <a-form-model-item :label="item.label" :prop="item.labelKey">
              <div v-if="item.type == 'btnText'">
                <div style="display: flex; width: 100%; flex-wrap: wrap">
                  <a-input
                          style="
                      width: 65% !important;
                      border-top-right-radius: 0;
                      border-bottom-right-radius: 0;
                    "
                          :placeholder="'请输入' + item.label"
                          disabled
                          v-model="measuresObj[item.labelKey]"
                  />
                  <a-button
                          :disabled="!item.isTrue"
                          style="
                      width: 35%;
                      height: 34px;
                      margin-left: 0 !important;
                      border-top-left-radius: 0;
                      border-bottom-left-radius: 0;
                    "
                          type="primary"
                          @click.stop="chooseItem(item.click, item.value)"
                  >
                    选择
                  </a-button>
                </div>
              </div>
              <div v-if="item.type == 'dataTime'">
                <a-date-picker
                        style="min-width: 176px !important"
                        @change="itemClick(item.labelKey)"
                        show-time
                        v-model="measuresObj[item.labelKey]"
                        :disabled="!item.isTrue"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        format="YYYY-MM-DD HH:mm:ss"
                >
                </a-date-picker>
              </div>
              <div v-if="item.type == 'dataTimes'">
                <a-date-picker
                        @change="itemClick(item.labelKey)"
                        show-time
                        v-model="measuresObj[item.labelKey]"
                        :disabled="!item.isTrue"
                        valueFormat="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                >
                </a-date-picker>
              </div>
              <!--input输入框-->
              <a-input
                      :placeholder="'请输入' + item.label"
                      :disabled="!item.isTrue"
                      v-model="measuresObj[item.labelKey]"
                      v-if="item.type == 'input'"
              />
              <!--多行输入框-->
              <a-textarea
                      maxlength="1000"
                      :placeholder="'请输入' + item.label"
                      v-model="measuresObj[item.labelKey]"
                      :disabled="!item.isTrue"
                      v-if="item.type == 'textArea'"
                      :rows="3"
              />
              <!--下拉框-->
              <a-select
                      @change="itemClick(item.labelKey)"
                      v-if="item.type == 'select'"
                      style="width: 100%"
                      :disabled="!item.isTrue"
                      show-search
                      :placeholder="'请选择' + item.label"
                      option-filter-prop="children"
                      v-model="measuresObj[item.labelKey]"
                      :filter-option="filterOption"
              >
                <a-select-option
                        v-for="(items, index) in item.data"
                        :value="items.value"
                        :key="index"
                >
                  {{ items.label }}
                </a-select-option>
              </a-select>
              <a-select
                      @change="itemClick(item.labelKey)"
                      v-if="item.type == 'selectAll'"
                      mode="multiple"
                      :disabled="!item.isTrue"
                      v-model="measuresObj[item.labelKey]"
                      :placeholder="'请选择' + item.label"
                      style="width: 100%"
              >
                <a-select-option
                        v-for="(items, index) in item.data"
                        :value="items.value"
                        :key="index"
                >
                  {{ items.label }}
                </a-select-option>
              </a-select>
              <a-radio-group
                      v-model="measuresObj[item.labelKey]"
                      :disabled="!item.isTrue"
                      v-if="item.type == 'radio'"
                      :name="item.labelKey"
                      :default-value="item.data[0]"
              >
                <a-radio
                        v-model="measuresObj[item.labelKey]"
                        v-for="(items, index) in item.data"
                        :key="index"
                >
                  {{ items.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- </a-card> -->
    </a-row>
  </div>
</template>

<script>
    /****
     * 组件封装用法
     * measuresForm
     * ******/
    export default {
        name: '',
        props: {
            measuresForm: {
                type: Array,
            },
        },
        data() {
            return {
                measuresObj: {},
                rules: {},
            }
        },
        created() {
            this.$nextTick(() => {
                console.log(this.measuresForm)
                this.getMeasuresForm()
            })
        },
        watch: {
            // measuresForm() {},
            measuresForm: {
                handler(newValue, oldValue) {
                    console.log(newValue)
                    this.getMeasuresForm(newValue)
                },
                deep: true,
            },
        },
        component: {
            //someComponent
        },

        mounted() {},
        methods: {
            getMeasuresForm() {
                setTimeout(() => {
                    this.measuresForm.forEach((element) => {
                        this.$set(this.measuresObj, element.labelKey, element.value)
                        this.rules[element.labelKey] = element.vDecorator
                    })
                }, 1)
            },
            itemClick(val) {
                // this.$set(this.measuresObj,val,this.measuresObj[val]);
            },
            chooseItem(click, val) {
                console.log(click, val)
                this.$emit(click, val)
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
                    case 24:
                        return this.labelCol
                }
            },
        },
    }
</script>

<style scoped lang="less">
  .dispatching-content {
    .dispatchingText {
      // display: inline-block;
      // width: 100%;
      // height: 30px;
      // border: 1px solid #ddd;
    }
    /deep/ .ant-form-item-label {
      overflow: unset;
      width: 120px !important;
      display: flex;
      height: 40px;
    }
    /deep/ .ant-form-item-label label {
      display: flex;
      justify-content: right;
      align-items: center;
      white-space: pre-wrap !important;
      line-height: normal !important;
      width: 120px !important;
      text-align: left;
    }
    /deep/ .ant-form-item-control {
      .ant-input,
      .ant-calendar-picker,
      .ant-select,
      .ant-select-selection {
        height: 34px;
        width: 180px !important;
      }
    }
  }
</style>
