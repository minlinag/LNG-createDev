<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'add' },
          { value: 'Delete', clickName: 'delete' },
        ]"
        @add="libraryDataAdd"
        @delete="confirm"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div class="riskManagement">
        <div class="left-bar">
          <div class="header_operate">
            <span>风险分解结构</span>
            <div class="operate_but">
              <a-button
                :disabled="
                  currentSelectNode.level <= 1 || currentSelectNode.level > 3
                "
                type="primary"
                icon="plus"
                size="small"
                @click="openNodeClick"
              />
              <a-popconfirm
                :placement="'right'"
                :title="'您确定要删除该节点吗?'"
                ok-text="确定"
                cancel-text="取消"
                :disabled="
                  currentSelectNode.level <= 2 ||
                  this.currentSelectNode.children.length > 0
                "
                @confirm="deleteNodeClick()"
              >
                <a-button
                  type="primary"
                  icon="minus"
                  size="small"
                  :disabled="
                    currentSelectNode.level <= 2 ||
                    this.currentSelectNode.children.length > 0
                  "
                />
              </a-popconfirm>
            </div>
          </div>
          <a-tree
            v-if="treeData.length > 0"
            :tree-data="treeData"
            :expandedKeys.sync="expandedKeys"
            :replace-fields="{
              children: 'children',
              title: 'label',
              key: 'id',
            }"
            @select="nodeSelect"
            class="tree_data"
          >
            <template
              #title="{ key: treeKey, label, id, level, code, reserve2 }"
            >
              <span>{{ label }}</span>
              <a-button
                type="primary"
                icon="edit"
                size="small"
                @click.stop="nodeEditClick(id, label, level, code, reserve2)"
                v-if="level > 2"
              />
            </template>
          </a-tree>
        </div>
        <div class="right-content">
          <div class="search">
            <a-form-model v-model="queryParams">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="操作日期:"
                  >
                    <a-range-picker
                      v-model="operationDateArray"
                      valueFormat="YYYY-MM-DD"
                      @change="onOperationDateTimeChange"
                      :placeholder="['开始日期', '结束日期']"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="作业单位:"
                  >
                    <a-select
                      show-search
                      v-model="queryParams.workUnit"
                      placeholder="请选择作业单位"
                      :filter-option="workUnitFilterOption"
                      :allow-clear="true"
                    >
                      <a-select-option
                        v-for="(item, index) in workUnitOptionData"
                        :key="index"
                        :value="item.value"
                        >{{ item.label }}
                      </a-select-option>
                    </a-select>
                    <!-- <a-input
                      v-model="queryParams.workUnit"
                      placeholder="请输入"
                    ></a-input> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="主管部门:"
                    ><a-select
                      v-model="queryParams.competentDepartment"
                      @change="competentDepartmentChange"
                      placeholder="请选择主管部门"
                      :allow-clear="true"
                    >
                      <a-select-option
                        v-for="(item, index) in competentDepartmentOption"
                        :key="index"
                        :value="item.dictname"
                        >{{ item.dictname }}
                      </a-select-option>
                    </a-select>
                    <!-- <a-input
                      v-model="queryParams.competentDepartment"
                      placeholder="请输入"
                    ></a-input> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="风险分解结构:"
                  >
                    <a-tree-select
                      v-model="riskDecompositionStructureId"
                      placeholder="请选择风险分解结构"
                      :replaceFields="{
                        children: 'children',
                        title: 'label',
                        value: 'id',
                        key: 'id',
                      }"
                      :treeData="riskDecompositionStructureOption"
                      @select="riskDecompositionStructureSelect"
                      @change="riskDecompositionStructureChange"
                      :allowClear="true"
                    ></a-tree-select>
                    <!-- <a-input
                      v-model=""
                      placeholder="请输入"
                    ></a-input> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="风险分解结构:"
                  >
                    <a-tree-select
                      v-model="riskDecompositionStructureId"
                      placeholder="请选择风险分解结构"
                      :replaceFields="{
                        children: 'children',
                        title: 'label',
                        value: 'id',
                        key: 'id',
                      }"
                      :treeData="riskDecompositionStructureOption"
                      @select="riskDecompositionStructureSelect"
                      @change="riskDecompositionStructureChange"
                      :allowClear="true"
                    ></a-tree-select>
                    <!-- <a-input
                      v-model=""
                      placeholder="请输入"
                    ></a-input> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="区域名称："
                  >
                    <a-select
                      :allowClear="true"
                      style="width: 100%"
                      show-search
                      placeholder="请选择"
                      v-model="queryParams.areaName"
                    >
                      <a-select-option
                        v-for="(item, index) in areaList"
                        :key="index"
                        :value="item.dictname"
                      >
                        {{ item.dictname }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="单元名称："
                  >
                    <a-input
                      v-model="queryParams.unitName"
                      placeholder="请输入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="风险评价等级:"
                  >
                    <a-select
                      :allow-clear="true"
                      v-model="queryParams.riskRating"
                      placeholder="请选择风险评价等级"
                    >
                      <a-select-option value="低风险"> 低风险 </a-select-option>
                      <a-select-option value="一般风险">
                        一般风险
                      </a-select-option>
                      <a-select-option value="较大风险">
                        较大风险
                      </a-select-option>
                      <a-select-option value="重大风险">
                        重大风险
                      </a-select-option>
                    </a-select>
                    <!-- <a-input
                      v-model="queryParams.riskRating"
                      placeholder="请输入"
                    ></a-input> -->
                    <!-- 下拉框 -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 140px' }"
                    label="分析人:"
                  >
                    <a-input
                      v-model="queryParams.analysisUser"
                      placeholder="请输入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24" style="text-align: right">
                  <a-form-model-item>
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="search()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click="resetForm">
                      重置
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
          <dc-table
            @change="paginationChange"
            :pagination="pagination"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '30px',
            }"
            :expanded-row-keys.sync="defaultDeployment"
            class="list_table_3"
            :scroll="{ y: 1, x: 100 }"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <template slot="riskRating" slot-scope="row">
              <div>
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    float: left;
                  "
                  :class="updateBg(row)"
                ></div>
                {{ row }}
              </div>
            </template>
            <template slot="operation" slot-scope="row">
              <span
                class="btn_link"
                style="cursor: pointer"
                @click="editListClick(row)"
              >
                编辑
              </span>
              <span
                class="btn_link"
                style="cursor: pointer"
                @click="checkListClick(row)"
              >
                详情
              </span>
            </template>
          </dc-table>
          <a-modal
            :width="'1020px'"
            v-model="visible"
            :title="modelConfig.title"
            :cancelText="false"
            class="dc_model bigModel"
            :after-close="riskLibraryModelClose"
            :maskClosable="false"
          >
            <a-form-model
              ref="riskLibraryRef"
              :model="riskLibraryForm"
              :rules="riskLibraryRules"
              class="risk_form_model"
            >
              <a-form-model-item label="作业单位" prop="workUnit">
                <a-select
                  v-model="riskLibraryForm.workUnit"
                  placeholder="请选择作业单位"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in workUnitOptionData"
                    :key="index"
                    :value="item.value"
                    >{{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="主管部门" prop="competentDepartment">
                <a-select
                  v-model="riskLibraryForm.competentDepartment"
                  placeholder="请选择"
                  @change="competentDepartmentChange"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in competentDepartmentOption"
                    :key="index"
                    :value="item.dictname"
                    >{{ item.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                label="风险分解结构"
                prop="riskDecompositionStructureName"
              >
                <a-input
                  :value="
                    modelConfig.title == '风险库-添加'
                      ? `${currentSelectNode.ppName}-${currentSelectNode.pname}-${riskLibraryForm.riskDecompositionStructureName}`
                      : riskRowDecompositionStructureName
                  "
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item label="区域名称" prop="areaName">
                <a-select
                  v-model="riskLibraryForm.areaName"
                  placeholder="请选择"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in areaList"
                    :key="index"
                    :value="item.dictname"
                  >
                    {{ item.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item label="单元名称" prop="unitName">
                <a-input
                  v-model="riskLibraryForm.unitName"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
              <a-form-model-item label="危害因素" prop="hazardFactors">
                <a-input
                  v-model="riskLibraryForm.hazardFactors"
                  placeholder="请输入危害因素"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
              <a-form-model-item prop="l">
                <template slot="label">
                  <span>L</span>
                  <a-tooltip
                    placement="topLeft"
                    title="发生事故或事件的可能性"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-select
                  v-model="riskLibraryForm.l"
                  placeholder="请输入L"
                  @change="handleFormChange('l')"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in lOption"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                prop="e"
                :disabled="
                  riskLibraryFormState == 'check' ||
                  riskLibraryFormStatus == '已提交'
                "
              >
                <template slot="label">
                  <span>E</span>
                  <a-tooltip
                    placement="topLeft"
                    title="暴露于潜在危害环境的频繁程度"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-select
                  v-model="riskLibraryForm.e"
                  placeholder="请输入E"
                  @change="handleFormChange('e')"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in eOption"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="c">
                <template slot="label">
                  <span>C</span>
                  <a-tooltip
                    placement="topLeft"
                    title="发生事故产生的后果"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-select
                  v-model="riskLibraryForm.c"
                  placeholder="请输入C"
                  @change="handleFormChange('c')"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in cOption"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="d">
                <template slot="label">
                  <span>D = L x E x C</span>
                  <a-tooltip
                    placement="topLeft"
                    title="风险评价值"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-input v-model="riskLibraryForm.d" :disabled="true" />
              </a-form-model-item>
              <a-form-model-item label="风险评价等级" prop="riskRating">
                <a-input
                  v-model="riskLibraryForm.riskRating"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item
                class="risk_controls"
                label="风险管控措施"
                prop="riskControls"
              >
                <a-input
                  type="textarea"
                  v-model="riskLibraryForm.riskControls"
                  placeholder="请输入风险管控措施"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
              <a-form-model-item
                label="分析人"
                prop="analysisUser"
                :labelCol="{ style: 'width: 150px' }"
                v-if="riskLibraryFormState == 'check'"
              >
                <a-input
                  v-model="riskLibraryForm.analysisUser"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item
                label="操作日期"
                prop="operationDateTime"
                v-if="riskLibraryFormState == 'check'"
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-input
                  v-model="riskLibraryForm.operationDateTime"
                  :disabled="true"
                />
              </a-form-model-item>
              <!-- <a-form-model-item class="form_but">
                <a-button
                  type="primary"
                  @click="onRiskLibrarySubmit('已保存')"
                  :disabled="riskLibraryFormStatus == '已提交'"
                  v-if="riskLibraryFormState !== 'check'"
                >
                  保存
                </a-button>
                 <a-button
                  type="primary"
                  @click="onRiskLibrarySubmit('已提交')"
                  :disabled="riskLibraryFormStatus == '已提交'"
                  v-if="riskLibraryFormState !== 'check'"
                >
                  {{ riskLibraryFormStatus == '已提交' ? '已提交' : '提交' }}
                </a-button> -->
              <!-- <a-button @click="onRiskLibraryBack"> 返回 </a-button>
              </a-form-model-item>  -->
            </a-form-model>
            <template #footer>
              <a-button
                type="primary"
                @click="onRiskLibrarySubmit('已保存')"
                :disabled="riskLibraryFormStatus == '已提交'"
                v-if="riskLibraryFormState !== 'check'"
              >
                保存
              </a-button>
              <a-button @click="onRiskLibraryBack"> 取消 </a-button>
            </template>
          </a-modal>
        </div>
        <a-modal
          :title="nodeModalTitle"
          :dialog-style="{ top: '20px' }"
          width="600px"
          class="node_modal from-style"
          :visible="nodeReviseModalVisible"
          @ok="handleNodeModalOk"
          @cancel="handleNodeModalCancel"
          :maskClosable="false"
        >
          <!-- :rules="rules" -->
          <a-form-model
            ref="nodeForm"
            :model="nodeForm"
            layout="inline"
            :rules="nodeFormRules"
            class="node_form"
          >
            <a-row>
              <a-col :span="12" v-if="currentSelectNode.level == 3">
                <a-form-model-item label="序号" key="1">
                  <a-input
                    disabled
                    v-model="nodeForm.reserve2"
                    placeholder=""
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" v-if="currentSelectNode.level == 3">
                <a-form-model-item label="编码" key="2">
                  <a-input
                    disabled
                    v-model="nodeForm.dictcode"
                    placeholder=""
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row style="width: 100%">
              <a-col :span="12">
                <a-form-model-item key="3" prop="dictname">
                  <template slot="label">
                    <span>名称</span>
                    <a-tooltip
                      placement="topLeft"
                      :title="
                        currentSelectNode.level == 2
                          ? '请输入特殊作业级别、作业名称，例如:一级动火作业'
                          : '叶子节点提示:请输入特殊作业中的作业活动，例如:焊接'
                      "
                      arrow-point-at-center
                    >
                      <a-icon type="question-circle" class="label_icon" />
                    </a-tooltip>
                  </template>
                  <a-input
                    v-model="nodeForm.dictname"
                    placeholder="请输入名称"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" v-if="currentSelectNode.level == 2">
                <a-form-model-item key="4" label="工具" prop="reserve2">
                  <a-input
                    v-model="nodeForm.reserve2"
                    placeholder="请输入工具"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
          <template #footer>
            <a-button type="primary" @click="handleNodeModalOk">
              保存
            </a-button>
            <a-button @click="handleNodeModalCancel"> 取消 </a-button>
          </template>
        </a-modal>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getRiskList,
  getDictTree,
  dictAddDict,
  dictUpdateDict,
  dictDeleteDictFX,
  fxkInsert,
  fxkSelectByID,
  fxkUpdate,
  fxkDelete,
} from '@/api/riskManagementList'
import {
  getdict,
} from '@/api/securityRiskcontrol'
import { companySelect } from '@/api/JSAAnalysis'
import { pinyin } from 'pinyin-pro'
import { encode } from '@/api/public.js'
import Decimal from 'decimal.js';
export default {
  name: 'ProfessionalLibrary',
  data() {
    return {
      echoMap: {},
      searchValue: '',
      selectedRowKeys: [],
      selectedKeys: 'SJZD',
      defaultDeployment: [],
      lOption: [0.1, 0.2, 0.5, 1, 3, 6, 10],
      eOption: [0.5, 1, 2, 3, 6, 10],
      cOption: [1, 2, 7, 15, 40, 100],
      competentDepartmentOption: [],
      queryParams: {
        operationDateTimeStart: '',
        operationDateTimeEnd: '', //操作日期
        riskDecompositionStructureName: '',
        areaName: undefined, // 作业区域
        unitName: '', // 作业单位
        hazardFactors: '', // 危害因素
        analysisUser: '', //  分析人
        workUnit: undefined, // 作业单位
        competentDepartment: undefined, // 主管部门
        riskRating: undefined, // 评估等级
        pageNum: 1,
        pageSize: 10,
      },
      riskDecompositionStructureId: undefined,
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      visible: false,
      modelConfig: {
        width: '1020px',
        title: '风险库',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      riskDecompositionStructureOption: [],
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      workUnitOptionData: [],
      riskLibraryForm: {
        riskDecompositionStructureCode: '', // 分析结构
        riskDecompositionStructureName: '',
        hazardFactors: '',
        areaName: undefined, // 作业区域
        unitName: '',
        l: undefined,
        e: undefined,
        c: undefined,
        d: '',
        riskControls: '',
        workUnit: undefined, // 作业单位
        competentDepartment: undefined, // 主管部门
        riskRating: undefined, // 评估等级
      },
      operationDateArray: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: '作业单位',
          dataIndex: 'workUnit',
          width: 120,
        },
        {
          title: '主管部门',
          dataIndex: 'competentDepartment',
          width: 120,
        },
        {
          title: '风险分解结构',
          dataIndex: 'riskDecompositionStructureName',
          width: 200,
        },
        {
          title: '区域名称',
          dataIndex: 'areaName',
          width: 200,
        },
        {
          title: '单元名称',
          dataIndex: 'unitName',
          width: 200,
        },
        {
          title: '危害因素',
          dataIndex: 'hazardFactors',
          width: 100,
        },
        {
          title: 'L',
          dataIndex: 'l',
          width: 50,
        },
        {
          title: 'E',
          dataIndex: 'e',
          width: 50,
        },
        {
          title: 'C',
          dataIndex: 'c',
          width: 50,
        },
        {
          title: 'D',
          dataIndex: 'd',
          width: 70,
        },
        {
          title: '风险评价等级',
          dataIndex: 'riskRating',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'riskRating' },
        },
        {
          title: '分析人',
          dataIndex: 'analysisUser',
          width: 70,
        },
        {
          title: '操作日期',
          dataIndex: 'operationDateTime',
          width: 150,
        },
        {
          title: '操作',
          width: 100,
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
        },
      ],
      riskRowDecompositionStructureName: "",
      dataSource: [],
      treeSelect: [],
      treeData: [],
      expandedKeys: ['0-0-0', '0-0-1'],
      nodeReviseModalVisible: false,
      nodeModalTitle: '风险分解结构-添加',
      nodeForm: {
        dictcode: '',
        dictname: '',
        reserve2: '',
      },
      currentSelectNode: {
        level: 0,
      },
      riskLibraryFormState: '',
      riskLibraryFormStatus: '',
      areaList: [],
      riskLibraryRules: {
        workUnit: [
          { required: true, message: '作业单位不能为空', trigger: 'blur' },
        ],
        competentDepartment: [
          { required: true, message: '主管部门不能为空', trigger: 'blur' },
        ],
        areaName: [{ required: true, message: '区域名称不能为空', trigger: 'change' }],
        unitName: [{ required: true, message: '单元名称不能为空', trigger: 'blur' }],
        hazardFactors: [
          { required: true, message: '危害因素不能为空', trigger: 'blur' },
        ],
        l: [{ required: true, message: 'L不能为空', trigger: 'blur' }],
        e: [{ required: true, message: 'E不能为空', trigger: 'blur' }],
        c: [{ required: true, message: 'C不能为空', trigger: 'blur' }],
        riskControls: [
          { required: true, message: '风险管控措施不能为空', trigger: 'blur' },
        ],
      },
      nodeFormRules: {
        dictname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        reserve2: [{ required: true, message: '请输入工具', trigger: 'blur' }],
      },
      hazardFactors: [{ required: true, message: '危害因素不能为空', trigger: 'blur' }],
    }
  },

  mounted() {
    this.getRiskList()
    this.encodeTree()
    this.getOutsourceCompany()
    this.getEncode()
    this.getdict()
  },
  methods: {
    workUnitFilterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    competentDepartmentChange() { },
    getEncode() {
      encode('LBSQ_SSBM').then((res) => {
        if (res.code == 200) {
          this.competentDepartmentOption = res.body.data.filter((item) => {
            let newItem = item
            if (newItem.dictname !== '公司领导') {
              return newItem
            }
          })
        }
      })
    },
    riskDecompositionStructureSelect(value, node, extra) {
      if (node.dataRef.children.length > 0) {
        this.queryParams.riskDecompositionStructureName = ''
      } else {
        this.queryParams.riskDecompositionStructureName = node.dataRef.label
      }
    },
    riskDecompositionStructureChange(value) {
      if (!value) {
        this.queryParams.riskDecompositionStructureName = ''
      }
    },
    onRiskLibrarySubmit(recordStatus) {
      this.$refs.riskLibraryRef.validate((valid) => {
        if (valid) {
          if (!this.riskLibraryForm.hasOwnProperty('id')) {
            let riskLibraryForm = JSON.parse(JSON.stringify(this.riskLibraryForm))
            riskLibraryForm.riskDecompositionStructureName = `${this.currentSelectNode.pname}-${this.currentSelectNode.ppName}-${this.riskLibraryForm.riskDecompositionStructureName}`
            fxkInsert(riskLibraryForm).then((res) => {
              if (res.code == 200) {
                this.getRiskList()
                this.visible = false
                this.$message.success('添加成功')
              }
            })
          } else {
            this.riskLibraryForm.recordStatus = recordStatus
            fxkUpdate(this.riskLibraryForm).then((res) => {
              if (res.code == 200) {
                if (recordStatus == '已保存') {
                  this.visible = false
                  this.$message.success('修改成功')
                } else {
                  this.visible = false
                  this.$message.success('提交成功')
                }
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onRiskLibraryBack() {
      this.visible = false
    },
    riskLibraryModelClose() {
      this.riskLibraryFormInitial()
    },
    riskLibraryFormInitial() {
      this.riskLibraryFormState = ''
      this.riskLibraryFormStatus = ''
      this.riskLibraryForm = {
        workUnit: undefined,
        competentDepartment: undefined,
        riskDecompositionStructureCode: '', // 分析结构
        riskDecompositionStructureName: '',
        hazardFactors: '',
        areaName: undefined,
        unitName: '',
        l: undefined,
        e: undefined,
        c: undefined,
        d: '',
        riskRating: undefined,
        riskControls: '',
      }
      this.$refs.riskLibraryRef.clearValidate()
    },
    // 获取外委单位列表
    getOutsourceCompany() {
      companySelect().then((res) => {
        res.body.forEach((item) => {
          this.workUnitOptionData.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          })
        })
      })
    },
    handleFormChange(name) {
      // let numberFormKey = ['l', 'e', 'c']
      // if (numberFormKey.includes(name)) {

      this.riskLibraryForm[name] = this.convertNumber(
        this.riskLibraryForm[name]
      )

      let newL = ''
      let newE = ''
      let newC = ''
      let calculateD = 0

      for (const key in this.riskLibraryForm) {
        if (Object.hasOwnProperty.call(this.riskLibraryForm, key)) {
          const element = this.riskLibraryForm[key]
          if (key === name) {
            this.riskLibraryForm[key] = this.riskLibraryForm[name]
          }
          if (key == 'l') {
            newL = element
          }
          if (key == 'e') {
            newE = element
          }
          if (key == 'c') {
            newC = element
          }
        }
      }
      calculateD = new Decimal(newL).mul(newE).mul(newC)
      this.riskLibraryForm.d = isNaN(calculateD) ? '' : calculateD

      if (calculateD > 320) {
        this.riskLibraryForm.riskRating = '重大风险'
      } else if (calculateD > 160) {
        this.riskLibraryForm.riskRating = '较大风险'
      } else if (calculateD > 70) {
        this.riskLibraryForm.riskRating = '一般风险'
      } else if (calculateD >= 0) {
        this.riskLibraryForm.riskRating = '低风险'
      }
    },

    convertNumber(value) {
      let newValue = value
      // this.tableData[e].goodsCost 是input的值
      // 先把非数字的都替换掉，除了数字和.

      newValue = String(newValue).replace(/[^\d.]/g, '')

      // 必须保证第一个为数字而不是.
      newValue = String(newValue).replace(/^\./g, '')

      // 保证只有出现一个.而没有多个.
      newValue = String(newValue).replace(/\.{2,}/g, '')
      // 保证.只出现一次，而不能出现两次以上
      newValue = String(newValue)
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      let index = -1
      for (let i in newValue) {
        if (newValue[i] === '.') {
          index = i
        }
        if (index !== -1) {
          if (i - index > 2) {
            newValue = String(newValue).substring(0, newValue.length - 1)
          }
        }
      }
      return newValue
    },

    isNumber(val) {
      if (val == '') {
        return false
      }
      var regPos = /^[0-9]+.?[0-9]*/
      if (regPos.test(val)) {
        return true
      } else {
        return false
      }
    },
    onOperationDateTimeChange(data) {
      this.queryParams.operationDateTimeStart = data[0]
      this.queryParams.operationDateTimeEnd = data[1]
    },
    openNodeClick() {
      if (this.currentSelectNode.level === '3') {
        let pinyinFirst = pinyin(this.currentSelectNode.label, {
          pattern: 'first',
          toneType: 'none',
        })
          .replace(/\s*/g, '')
          .toUpperCase()
        let serialNumber
        if (this.currentSelectNode.children.length < 10) {
          serialNumber = '00' + this.currentSelectNode.children.length
        } else if (this.currentSelectNode.children.length < 100) {
          serialNumber = '00' + this.currentSelectNode.children.length
        } else {
          serialNumber = '' + this.currentSelectNode.children.length
        }
        this.nodeForm = {
          dictcode: pinyinFirst + serialNumber,
          dictname: '',
          reserve2: String(this.currentSelectNode.children.length + 1),
        }
      } else {
        this.nodeForm = {
          dictcode: '',
          dictname: '',
          reserve2: '',
        }
      }

      this.nodeReviseModalVisible = true
      this.$refs.nodeForm.resetFields()
      this.nodeModalTitle = '风险分解结构-添加'
    },
    deleteNodeClick() {
      dictDeleteDictFX({ id: this.currentSelectNode.id }).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功！')
          this.currentSelectNode = {
            level: 0,
          }
          this.encodeTree()
        }
      })
    },
    nodeSelect(selectedKeys, e) {
      if (selectedKeys.length === 0) {
        this.currentSelectNode = { level: 0 }
      } else {
        this.currentSelectNode = this.$lodash.cloneDeep(e.node.dataRef)
      }
    },
    nodeEditClick(id, label, level, code, reserve2) {
      let newLevel = level
      this.currentSelectNode.level = newLevel - 1
      // let labelCut = label.split('-')
      // let labelCutPop = labelCut.pop()
      this.nodeForm = {
        dictcode: code,
        dictname: label,
        reserve2: reserve2,
        id: id,
      }
      this.nodeModalTitle = '风险分解结构-编辑'

      this.nodeReviseModalVisible = true
      this.$refs.nodeForm.resetFields()
    },
    handleNodeModalOk() {
      this.$refs.nodeForm.validate((valid) => {
        if (valid) {
          let nodeForm = this.nodeForm
          let dictData = {
            id: nodeForm.id || nodeForm.dictcode,
            dictid: nodeForm.dictcode,
            dictcode:
              nodeForm.dictcode === ''
                ? 'fxjg' + new Date().valueOf()
                : nodeForm.dictcode,
            dictlevel: String(Number(this.currentSelectNode.level) + 1),
            dictname: nodeForm.dictname,
            reserve2: nodeForm.reserve2,
            parentid: this.currentSelectNode.id,
          }
          if (this.nodeModalTitle != '风险分解结构-编辑') {
            dictAddDict(dictData).then((res) => {
              if (res.code == 200) {
                this.encodeTree()
                this.$message.success('添加成功！')
                this.currentSelectNode.children.push({})
                this.nodeReviseModalVisible = false
              }
            })
          } else {
            dictUpdateDict({
              id: dictData.id,
              dictname: dictData.dictname,
              reserve2: dictData.reserve2,
            }).then((res) => {
              if (res.code == 200) {
                this.encodeTree()
                this.$message.success('编辑成功！')
                this.nodeReviseModalVisible = false
              }
            })
          }
        }
      })
    },
    handleNodeModalCancel() {
      this.nodeReviseModalVisible = false
    },
    onSelect(value) {
      this.treeSelect = value
      this.getRiskList(1, 10, ...value)
    },
    editListClick(row) {
      this.riskLibraryFormState = 'edit'
      this.modelConfig.title = '风险库-编辑'
      this.fxkSelectDataEcho(row.id)
      this.riskRowDecompositionStructureName = row.riskDecompositionStructureName
      this.visible = true
    },
    checkListClick(row) {
      this.riskRowDecompositionStructureName = row.riskDecompositionStructureName
      this.modelConfig.title = '风险库-详情'
      this.riskLibraryFormState = 'check'
      this.fxkSelectDataEcho(row.id)
      this.visible = true
    },
    fxkSelectDataEcho(id) {
      fxkSelectByID({ ID: id }).then((res) => {
        this.riskLibraryForm = res.body
        this.riskLibraryFormStatus = res.body.recordStatus
      })
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    search() {
      this.getRiskList()
    },

    paginationChange(pagination) {
      this.queryParams.pageNum = pagination.current
      this.queryParams.pageSize = pagination.pageSize
      this.getRiskList()
    },
    libraryDataAdd() {
      if (this.currentSelectNode.level === '4') {
        this.visible = true
        this.riskLibraryForm.riskDecompositionStructureCode =
          this.currentSelectNode.code
        this.riskLibraryForm.riskDecompositionStructureName =
          `${this.currentSelectNode.label}`
        this.modelConfig.title = '风险库-添加'
        this.riskLibraryFormState = 'add'
      } else {
        this.$message.warning('请选择有效的风险分解结构节点')
      }
    },
    confirm(e) {
      this.Delete()
    },
    onContextMenuClick(treeKey, menuKey) {

    },
    save(value) {
      this.echoMap = {}
      value.parentid = this.treeSelect.length == 0 ? 'SJZD' : this.treeSelect[0]
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          if (value.id) {
            dictPut(value).then((res) => {
              this.getRiskList(1, 10, this.treeSelect[0])
            })
            this.visible = false
            this.$message.success('保存成功！')
            this.echoMap = {}
          } else {
            if (!this.treeSelect.length) {
              this.$message.warning(
                '请选择其中一条内容进行添加并且完整填写内容'
              )
            } else {
              getRiskList(value).then((res) => {
                this.getRiskList(1, 10, this.treeSelect[0])
                this.encodeTree()
              })
              this.visible = false
              this.$message.success('保存成功！')
            }
          }
        } else {
          this.$message.warning('请完整填写内容')
        }
        // this.dictionList()
      })
    },
    Delete() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('至少选中一项要删除的数据')
      } else {
        fxkDelete(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getRiskList()
            this.selectedRowKeys = []
          }
        })
      }
    },
    //重置输入
    resetForm() {
      this.queryParams = {
        operationDateTimeStart: '',
        operationDateTimeEnd: '', //操作日期
        riskDecompositionStructureName: '',
        areaName: undefined, // 作业区域
        unitName: '', // 作业单位
        hazardFactors: '', // 危害因素
        analysisUser: '', //  分析人
        workUnit: undefined, // 作业单位
        competentDepartment: undefined, // 主管部门
        riskRating: undefined, // 评估等级
        pageNum: 1,
        pageSize: 10,
      }
      this.riskDecompositionStructureId = undefined
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.operationDateArray = []
      this.getRiskList()
      // this.$refs.ruleForm.resetFields();
      // this.Config.formDataList.forEach(item => item.type == 'radio' ? item.value = false : item.value = "")
    },

    cancel(value) {
      this.visible = false
    },
    encodeTree() {
      getDictTree().then((res) => {
        let data = res.body.data[0].children
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          if (element.id === 'ZYXKGL-ZYLX') {
            this.treeData = this.$lodash.cloneDeep([element])
            this.riskDecompositionStructureOption = element.children.map(
              (item) => {
                let newItem = this.disableLevel(item, 1)
                return newItem
              }
            )
            return false
          }
        }
      })
    },
    disableLevel(val, level) {
      let newVal = val

      if (level < 3) {
        newVal.selectable = false
        for (let index = 0; index < newVal.children.length; index++) {
          const element = newVal.children[index]
          this.newVal = this.disableLevel(element, level + 1)
        }
      }
      return newVal
    },
    getRiskList() {
      getRiskList(this.queryParams).then((res) => {
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.total = res.body.total
        this.pagination.pageSize = res.body.pageSize
      })
    },
    updateBg(row) {
      if (row == '重大风险') {
        return 'bgColorRed'
      } else if (row == '较大风险') {
        return 'bgColorO'
      } else if (row == '一般风险') {
        return 'bgColorY'
      } else {
        return 'bgColorB'
      }
    },
    getdict() {
      getdict({}).then((res) => {
        this.areaList = res.body.data
        // console.log(res.body.data, 'render')
      })
    },
  },
}
</script>
 <style scoped lang="less">
.riskManagement {
  display: flex;
  width: 100%;
  /deep/.tree_layout_sider,
  .left-bar {
    height: calc(100vh - 93px);
    max-width: 200px !important;
    min-width: 200px !important;
    .header_operate {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px #b6b6b6 solid;
      .operate_but {
        display: inline-block;
        .ant-btn + .ant-btn {
          margin-left: 5px;
        }
      }
    }
    .tree_data {
      .ant-btn-icon-only.ant-btn-sm {
        width: 16px;
        height: 16px;
        font-size: 10px;
        margin-left: 30px;
      }
    }
  }
  .left-bar {
    max-width: 19%;
    margin-right: 1%;
    background-color: #ececec;
    ::v-deep ul .ant-tree-treenode-selected .ant-tree-node-selected {
      width: 100%;
      line-height: 27px;
    }
    ::v-deep .ant-tree ul li span {
      line-height: 27px;
    }
    ::v-deep .ant-tree {
      height: calc(100vh - 140px);
      max-width: 200px !important;
      min-width: 200px !important;
      overflow: auto;
    }
  }
  .right-content {
    flex: auto;
    max-width: 80%;
  }
}
/deep/.search .ant-form-item {
  margin-bottom: 0;
}
.riskManagement > div {
  flex: 1 !important;
}
.node_modal {
  .ant-form {
    display: flex;
    flex-wrap: wrap;
    margin-top: -10px;
    .ant-form-item {
      // width: calc(50% - 16px);
      // margin-top: 20px;
    }
  }
}

.dc_model {
  ::v-deep .ant-col-8 {
    width: 50%;
  }
  ::v-deep .ant-col {
    margin-top: 6px;
    line-height: 20px;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // height: 55px;
  }
  ::v-deep .ant-form-item label {
    white-space: pre-wrap;
  }
}
.risk_form_model {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: calc(50% - 16px);
    height: 61px;
    // height: 30px;
    margin-bottom: 0px;
    margin-left: 10px;
    .ant-form-item-label {
      width: 127px !important;
      display: flex;
      align-items: center;
      height: 44px;
      label {
        width: 120px !important;
        font-size: 12px;
        // line-height: 43px;
      }
    }
    .ant-form-explain {
      font-size: 12px;
    }
  }
  .label_overstep {
    ::v-deep .ant-col {
      label {
        width: 119px;
        line-height: 0px;
      }
      label::after {
        top: -10.5px;
        margin: 0px -10px 0px 1px;
      }
      .ant-form-item-control {
        margin-left: 17px;
      }
    }
    ::v-deep .ant-form-item-control-wrapper:before {
      content: ":";
      position: absolute;
      top: 15.5px;
      margin: 0 4px 0 4px;
    }
  }
  .e_label_overstep {
    ::v-deep label {
      margin-left: 19px;
    }
  }
  .form_textarea {
    height: auto;
    margin-left: -17px;
    ::v-deep .ant-col {
      height: auto;
    }
  }
}
.form_but {
  width: 100% !important;
  display: flex;
  ::v-deep .ant-form-item-control {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
}
.node_form {
  ::v-deep .ant-row .ant-form-item-label label {
    width: 88px !important;
  }
}
.label_icon {
  font-size: 9px !important;
  margin-bottom: 10px;
  margin-left: 3px;
}
.ant-input[disabled] {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
.ant-select-disabled {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
.bgColorRed {
  background-color: red;
}
.bgColorO {
  background-color: #ff8b01;
}
.bgColorY {
  background-color: #fcf810;
}
.bgColorB {
  background-color: #1fb0ee;
}
.risk_controls {
  width: 100% !important;
  ::v-deep.ant-form-item .ant-form-item-label {
    width: 111px !important;
  }
}
.from-style .ant-modal-content .ant-form .ant-col {
  flex-direction: inherit;
}
::v-deep .ant-modal-footer {
  text-align: center;
}
</style>
