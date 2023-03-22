<template>
  <div class="wrapper">
    <a-form-model
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="form"
      :model="getForm(ConfigIn.formDataList)"
      :layout="layout"
      labelAlign="left"
    >
      <div v-if="ConfigIn.formDataList">
        <div  v-for="(item, index) in ConfigIn && ConfigIn.formDataList"
              :key="index">
            <FormitemDemoIn
              @handleChange="handleChange"
              @onSearch="onSearch"
              :itemConfig="item"
              :indexConfig="index"
              ref="demoIn"
            >
            </FormitemDemoIn>
              <slot name="table" v-if="item.type==='table'">
              </slot>
        </div>
      </div>
    </a-form-model>
    <div>
      <div
        v-for="(item, index) in ConfigIn && ConfigIn.otherConfigurations"
        :key="'slot' + index"
      >
        <slot
          v-if="item.type == 'otherTypes'"
          :name="item.slotScoped"
          :row="item"
        ></slot>
      </div>
      <div class="contneFormBtnStyle ant-modal-footer">
        <div
          class="contneFormBtnStyle-children"
          style="
             {
              margin-left: 10px;
            }
          "
          v-for="(item, index) in ConfigIn && ConfigIn.otherConfigurations"
          :key="'btn' + index"
          v-if="item.type == 'btn'"
        >
          <a-button
            :disabled="item.disabled"
            :type="item.btnType"
            @click="$emit(item.emit, getForm(ConfigIn.formDataList))"
          >
            {{ item.label }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    Config: Object,
    layout: String,
    labelCol: Object,
    wrapperCol: Object,
    echoMap: Object, //回显数据
  },
  data() {
    return {
      ConfigIn: {},
    };
  },
  watch: {
    echoMap: {
      handler() {
        this.getList();
      },
      deep: true,
    },
    Config: {
      handler(newArr) {
        this.ConfigIn = this.$lodash.cloneDeep(newArr);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    upDate(formKey = null, type = null, value = null) {
      let newArr = this.$lodash.cloneDeep(this.ConfigIn);
      // debugger
      if (formKey != null && type != null && value != null) {
        newArr.formDataList.map((item) => {
          if (item.formKey == formKey) {
            item[type] = value;
          }
        });
        this.ConfigIn = newArr;
      } else {
        newArr.formDataList.map((item) => {
          item.value = "";
        });
        this.ConfigIn = newArr;
      }
    },
    handleChange(item, index) {
      this.$set(this.ConfigIn.formDataList, index, item);
      this.$emit("handleChange", item);
    },
    onSearch(item) {
      this.$emit("enterButton", item);
    },
    getList() {
      if (this.echoMap !== undefined) {
        const echoArr = Object.keys(this.echoMap);
        if (echoArr.length !== 0) {
          for (let key in this.echoMap) {
            for (let keyObj in this.ConfigIn.formDataList) {
              if (this.ConfigIn.formDataList[keyObj].formKey == key) {
                this.ConfigIn.formDataList[keyObj].value = this.echoMap[key];
              }
            }
          }
          setTimeout(() => this.verificationRules(), 100);
        } else {
          this.$forceUpdate();
        }
      }
    },
    verificationRules(vlaue) {
      this.$refs.form.validate((valid) => {
        vlaue ? vlaue(valid) : "";
      });
    },
    getForm(item) {
      // console.log(item, 'item')
      let obj = {};
      for (let key in this.echoMap) {
        obj[key] = this.echoMap[key];
      }
      item.find((itemIn) => {
        if (!itemIn.formKey)
          return console.error(itemIn + "  formKey为空或者未填写请填写formKey");
        obj[itemIn.formKey] = itemIn.value;
      });
      return obj;
    },
  },
};
</script>
<style scoped lang="less">
.ant-form{
  padding: 23px!important;
}
.contneFormBtnStyle {
  display: flex;
  justify-content: center;
  margin-top: 15px;

  .contneFormBtnStyle-children {
    margin-left: 10px;
  }
}
.wrapper {
  ::v-deep.ant-form {
    .ant-form-item {
      margin-right: 16px;
      label {
        font-size: 12px;
      }
      .ant-select-selection--single {
        height: 34px;
      }
      .ant-input {
        height: 34px;
      }
      .ant-form-item-label > label::after {
        content: "";
      }
    }
  }
}
</style>
