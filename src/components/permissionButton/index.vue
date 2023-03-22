<template>
  <div class="wrapper" v-if="buttonList.length !== 0">
    <template v-for="(item, index) in buttonList">
      <a-popconfirm
        :key="index"
        :placement="item.popconfirmPlacement"
        :title="item.popconfirmTitle"
        ok-text="确定"
        cancel-text="取消"
        class="popconfirm_style"
        @confirm="deleteConfirm(item)"
        v-if="item.value === 'Delete' && item.show"
        :disabled="item.disabled"
      >
        <a-button
          :key="index"
          class="buttonType"
          :type="item.type"
          :class="[item.style]"
          :loading="item.loading"
          :disabled="item.disabled"
        >
          <svg-icon
            v-if="item.icon"
            class="button_svg"
            :icon-class="item.icon"
          />
          {{ item.name }}
        </a-button>
      </a-popconfirm>
      <ImportComponents
        :key="index"
        :data="item.data"
        :url="item.url"
        :accept="item.accept"
        :Text="item.name"
        :modalHint="item.modalHint"
        v-else-if="item.value === 'importComponent' && item.show"
        :disabled="item.disabled"
        @Import="importChange"
      >
      </ImportComponents>
      <ExportComponents
        :key="index"
        :Text="item.name"
        :url="item.url"
        :params="item.params"
        v-else-if="item.value === 'exportComponent' && item.show"
        :disabled="item.disabled"
      >
      </ExportComponents>
      <ExportComponents
        :key="index"
        :Text="item.name"
        :url="item.url"
        :params="item.params"
        v-else-if="item.value === 'templateExportComponent' && item.show"
        :disabled="item.disabled"
      >
      </ExportComponents>
      <a-button
        v-else-if="item.show"
        :key="index"
        class="buttonType"
        :type="item.type"
        :class="item.style"
        @click="$emit(`${item.clickName}`)"
        :loading="item.loading"
        :disabled="item.disabled"
      >
        <svg-icon v-if="item.icon" class="button_svg" :icon-class="item.icon" />
        {{ item.name }}
      </a-button>
    </template>
  </div>
</template>
<script>
// 未联调 isPower默认值为false，联调isPower默认值为true
export default {
  props: {
    include: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      basalData: {
        Add: {
          value: "Add",
          type: "primary",
          style: ["btn_primary"],
          icon: "Add-icon",
          name: "新增",
          clickName: "AddClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Maintain: {
          value: "Maintain",
          type: "primary",
          style: ["btn_primary"],
          icon: "Add-icon",
          name: "维护",
          clickName: "MaintainClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Report: {
          value: "Report",
          type: "primary",
          style: ["btn_primary"],
          icon: "Report-icon",
          name: "上报",
          clickName: "ReportClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Edit: {
          value: "Edit",
          type: "primary",
          style: ["btn_primary"],
          icon: "Edit-icon",
          name: "编辑",
          clickName: "EditClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Copy: {
          value: "Copy",
          type: "primary",
          style: ["btn_primary"],
          icon: "Copy-icon",
          name: "复制",
          clickName: "CopyClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Affirm: {
          value: "Affirm",
          type: "primary",
          style: ["btn_primary"],
          icon: "Affirm-icon",
          name: "确认",
          clickName: "AffirmClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Delete: {
          value: "Delete",
          type: "danger",
          style: ["btn_danger"],
          icon: "Delete-icon",
          name: "删除",
          popconfirmPlacement: "top",
          popconfirmTitle: "您确定要删除该项吗?",
          clickName: "DeleteClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        VERIFY: {
          value: "VERIFY",
          type: "primary",
          style: ["btn_primary"],
          icon: "VERIFY-icon",
          name: "审批",
          clickName: "VERIFYClick",
          loading: false,
          isPower: false,
          disabled: false,
          show: true,
        },
        Back: {
          value: "Back",
          type: "primary",
          style: ["btn_primary"],
          icon: "Back-icon",
          name: "意见反馈",
          clickName: "BackClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Issue: {
          value: "Issue",
          type: "primary",
          style: ["btn_primary"],
          icon: "Issue-icon",
          name: "下发",
          clickName: "IssueClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        Verify: {
          value: "Verify",
          type: "primary",
          style: ["btn_primary"],
          icon: "Verify--icon",
          name: "验收",
          clickName: "VerifyClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        SUBMIT: {
          value: "SUBMIT",
          type: "primary",
          style: ["btn_primary"],
          icon: "SUBMIT-icon",
          name: "提交",
          clickName: "SUBMITClick",
          loading: false,
          isPower: true,
          disabled: false,
          show: true,
        },
        importComponent: {
          value: "importComponent",
          data: {},
          url: "",
          accept: "",
          name: "导入",
          isPower: true,
          disabled: false,
          show: true,
        },
        exportComponent: {
          value: "exportComponent",
          url: "",
          params: {},
          name: "导出",
          isPower: false,
          disabled: false,
          show: true,
        },
        templateExportComponent: {
          value: "templateExportComponent",
          url: "",
          params: {},
          name: "模板导出",
          isPower: false,
          disabled: false,
          show: true,
        },
      },
    };
  },
  watch: {},
  computed: {
    buttonList() {
      const permissionButtonList = this.$store.state.permission.button;
      let newList = [];
      if (this.include.length === 0) {
        if (permissionButtonList.length === 0) {
          return [];
        } else {
          newList = permissionButtonList.map((item) => {
            return this.integrate(item.value, item, "String");
          });
        }
      } else {
        newList = this.generateButtonList(permissionButtonList);
      }
      return newList;
    },
  },
  created() { },
  mounted() { },
  methods: {
    importChange(info) {
      this.$emit('afterUpload', info)
    },
    deleteConfirm(item) {
      this.$emit(`${item.clickName}`);
    },
    generateButtonList(list) {
      let listFilter = [];
      for (let index = 0; index < this.include.length; index++) {
        const element = this.include[index];
        let newListItem = {};
        let exclusive = true;
        for (const key in this.basalData) {
          if (Object.hasOwnProperty.call(this.basalData, key)) {
            const elem = this.basalData[key];
            if (Object.prototype.toString.call(element) === "[object String]") {
              if (key === element) {
                exclusive = false;
                if (!elem.isPower) {
                  newListItem = this.integrate(element, elem, "String");
                  listFilter.push(newListItem);
                } else {
                  listFilter = this.backstageFind(
                    list,
                    element,
                    newListItem,
                    listFilter
                  );
                }
              }
            } else {
              if (key === element.value) {
                exclusive = false;
                if (element.hasOwnProperty("isPower")) {
                  elem.isPower = element.isPower;
                }
                if (!elem.isPower) {
                  newListItem = this.integrate(element, elem, "Object");
                  listFilter.push(newListItem);
                } else {
                  listFilter = this.backstageFind(
                    list,
                    element,
                    newListItem,
                    listFilter
                  );
                }
              }
            }
          }
        }
        if (exclusive) {
          newListItem = this.newBasalItem(element);
          listFilter.push(newListItem);
        }
      }
      return listFilter;
    },
    // value:类型必传
    integrate(val, origin, type) {
      let newVal = {};
      if (type === "String") {
        for (const key in this.basalData) {
          if (Object.hasOwnProperty.call(this.basalData, key)) {
            const element = this.basalData[key];
            if (key === val) {
              newVal = element;
            }
          }
        }
      } else {
        for (const key in this.basalData) {
          if (Object.hasOwnProperty.call(this.basalData, key)) {
            const element = this.basalData[key];
            if (key === val.value) {
              newVal = element;
              for (const k in val) {
                if (Object.hasOwnProperty.call(val, k)) {
                  newVal[k] = val[k];
                }
              }
            }
          }
        }
      }
      return newVal;
    },
    newBasalItem(val) {
      let newVal = {};
      if (Object.prototype.toString.call(val) === "[object String]") {
        newVal = {
          value: val,
          type: "primary",
          style: ["btn_primary"],
          icon: "",
          name: val,
          clickName: `${val}Click`,
          loading: false,
          isPower: false,
          disabled: false,
          show: true,
        };
      } else {
        if (!val.hasOwnProperty("value")) {
          console.error(`increase<<Type Object>> key "value" does not exist`);
          return false;
        }
        newVal = {
          value: val.value,
          type: "primary",
          style: ["btn_primary"],
          icon: "",
          name: val.value,
          clickName: `${val.value}Click`,
          loading: val.hasOwnProperty("loading") ? val.loading : false,
          isPower: val.hasOwnProperty("isPower") ? val.isPower : false,
          disabled: val.hasOwnProperty("disabled") ? val.disabled : false,
          show: val.hasOwnProperty("show") ? val.show : true,
        };

        for (const key in val) {
          if (Object.hasOwnProperty.call(val, key)) {
            const element = val[key];
            newVal[key] = element;
          }
        }
      }
      return newVal;
    },
    backstageFind(list, element, newListItem, listFilter) {
      let newListFilter = listFilter;
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (Object.prototype.toString.call(element) === "[object String]") {
          if (element === e.value) {
            newListItem = this.integrate(element, e, "String");
            newListFilter.push(newListItem);
          }
        } else {
          if (element.value === e.value) {
            newListItem = this.integrate(element, e, "Object");
            newListFilter.push(newListItem);
          }
        }
      }
      return newListFilter;
    },
  },
};
</script>
<style lang="less">
.ant-popover {
  .ant-popover-buttons {
    display: flex;
    flex-direction: row-reverse;
  }
}
span.popconfirm_style {
  background: rgba(212, 0, 0, 0);
  border: 1px solid rgba(212, 0, 0, 0);
}
span.popconfirm_style:hover {
  background-color: rgba(212, 0, 0, 0) !important;
  border-color: rgba(212, 0, 0, 0) !important;
}
.btn_link[disabled] {
  margin-right: 0px;
}
</style>
