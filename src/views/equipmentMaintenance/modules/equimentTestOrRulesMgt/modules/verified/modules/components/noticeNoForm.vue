<template>
  <div class="dispatching-content">
    <a-row :span="24">
      <a-card :bordered="false">
        <a-form-model ref="form" :model="measuresObj" :rules="rules">
          <a-row :gutter="24">
            <a-col
              :span="item.colSpan"
              v-for="(item, index) in measuresForm"
              :key="index"
            >
              <a-form-model-item
                :label="item.label"
                :labelCol="{
                  style: 'width:' + (item.width ? item.width : '150') + 'px',
                }"
                :prop="item.labelKey"
              >
                <div v-if="item.type == 'btnText'">
                  <div style="display: inline-block">
                    <a-input
                      :placeholder="'请输入' + item.label"
                      disabled
                      v-model="measuresObj[item.labelKey]"
                    />
                  </div>
                  <a-button
                    class="buttonType btn_primary"
                    type="primary"
                    disabled
                    @click.stop="chooseItem(item.click, item.value)"
                  >
                    选择
                  </a-button>
                </div>
                <a-date-picker
                  @change="itemClick(item.labelKey)"
                  show-time
                  v-model="measuresObj[item.labelKey]"
                  disabled
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                  v-if="item.type == 'dataTime'"
                >
                </a-date-picker>
                <!--input输入框-->
                <a-input
                  :placeholder="'请输入' + item.label"
                  disabled
                  v-model="measuresObj[item.labelKey]"
                  v-if="item.type == 'input'"
                />
                <!--多行输入框-->
                <a-textarea
                  :placeholder="'请输入' + item.label"
                  v-model="measuresObj[item.labelKey]"
                  disabled
                  v-if="item.type == 'textArea'"
                  :rows="1"
                />
                <!--下拉框-->
                <a-select
                  @change="itemClick(item.labelKey)"
                  v-if="item.type == 'select'"
                  style="width: 100%"
                  disabled
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
                  disabled
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
                  disabled
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
      </a-card>
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

  mounted() { },
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
/deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin: 0;
  padding: 0;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-form {
  display: flex;
  justify-content: left;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/ .equipmentDisplay-checkbox {
  margin-top: 10px;
}

.look {
  color: rgb(24, 144, 255);
  // color: white;
}

.Myserch {
  display: flex;
  justify-content: end;
}

.bar {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  background-color: #ececec;
  // box-shadow: 2px 2px 5px #333;
  border-radius: 5px;
}

span {
  cursor: pointer;
  padding: 0 5px;
}
.search-content {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>

