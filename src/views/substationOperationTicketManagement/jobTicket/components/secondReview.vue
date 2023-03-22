<template>
  <div>
    <div class="form_piece_title">
      <span>签发人填写</span>
    </div>
    <a-col :span="24" style="margin-top: 20px">
      <a-form-model-item label="工作条件">
        <a-input
          v-model.trim="formModel.conditions"
          placeholder="请输入"
          type="textarea"
          :auto-size="{ minRows: 6, maxRows: 6 }"
        ></a-input>
      </a-form-model-item>
    </a-col>
    <a-col :span="24" style="margin-top: 20px">
      <a-form-model-item label="注意事项">
        <a-input
          v-model.trim="formModel.attention"
          placeholder="请输入"
          type="textarea"
          :auto-size="{ minRows: 6, maxRows: 6 }"
        ></a-input>
      </a-form-model-item>
    </a-col>
  </div>
</template>

<script>

export default {
  name: "jobTicketAddEditForm",
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {
      formModel: {
        conditions: '', //工作条件
        attention: '', //工作地点保留带电部分或注意事项
      },
      companySelectOption: [], //单位下拉框
      singleTableLoading: false,
      runTime: [],
      contentState: true,
      moveStyle: {
        color: '#1890ff',
      },
    }
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (val) {
          this.formModel = {
            conditions: '',
            attention: '', //工作地点保留带电部分或注意事项
          }
        }
      },
      immediate: true,

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.form_piece_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    font-weight: 700;
  }
}
.file_list {
  ::v-deep .ant-form-item {
    margin-bottom: 0px;
  }
  .delete_color {
    color: #ff4d4f;
  }
  .delete_color[disabled] {
    color: rgba(0, 0, 0, 0.25);
  }
  .download_style {
    padding-left: 5px;
    border-left: 1px solid #ccc;
  }
}
.ant-input[disabled] {
  color: #000;
}
.start_run_time {
  ::v-deep .ant-form-item-control {
    .ant-input {
      width: 346px !important;
    }
  }
}
.number_people {
  margin-top: -10px;
  margin-left: 102px;
}
.implement {
  ::v-deep .ant-form-item-control {
    .ant-select-selection {
      width: 100% !important;
    }
  }
}
</style>