/** catalogue:[ { lable: '天', value:'a',//字段名与data的要对行 input:false
//是否编辑-- type为编辑且input为true可编辑------ } ], data:[ {a:111}, ]
catalogueLine:[ { label:'woshi yihang', value:'ww', col:1, align:'left',
position:top //top:上下显示 line 一行显示 }, { label:'woshi yihang',
value:'ww1', col:2 //一行几个，只有第一个值写col，这行剩下的对象不写这个参数 },
{ label:'woshi yihang', value:'ww2' } ], dataLine:{ ww:'111', ww1:'1112',
ww2:'1113', } */
<template>
  <div>
    <slot name="title" />
    <table class="tableFrom">
      <!-- 设置列宽 
      <colgroup slot="colW">
        <col style="width: 20%" />
        <col style="width: 60%" />
        <col style="width: 20%" />
     </colgroup>-->
      <slot name="colW" />
      <!-- <th :colspan="catalogue.length">
        <slot name="title" />
      </th> -->
      <tr>
        <slot />
      </tr>
      <tr>
        <td v-for="(item, index) in catalogue" :key="'1' + index">
          {{ item.lable }}
        </td>
      </tr>
      <tr v-for="(i, index) in data" :key="'2' + index">
        <td v-for="(j, jndex) in catalogue" :key="'3' + jndex">
          <a-input
            class="input"
            v-if="j.input && type === 'edit'"
            v-model="i[j?.value]"
          ></a-input>
          <span v-else>{{ i[j?.value] }}</span>
        </td>
      </tr>
      <tr v-for="(item, index) in catalogueLine" :key="'4' + index">
        <td
          :align="item.align || 'center'"
          :colspan="`${catalogue.length / item.col}`"
          v-for="(i, j) in item.col"
          :key="'5' + j"
        >
          <div v-if="item.position === 'top'">
            <div>{{ catalogueLine[`${index + i - 1}`]?.label }}</div>
            <div>{{ dataLine[catalogueLine[`${index + i - 1}`]?.value] }}</div>
          </div>
          <div v-else>
            {{
              `${catalogueLine[`${index + i - 1}`]?.label}:${
                dataLine[catalogueLine[`${index + i - 1}`]?.value]
              }`
            }}
          </div>
        </td>
      </tr>
      <th :colspan="catalogue.length">
        <slot name="footer" />
      </th>
    </table>
    <div class="footer" v-if="type === 'edit'">
      <a-button type="primary" @click="getData()">保存</a-button>
      <a-button @click="$emit('handleCancel')">取消</a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tableFrom',
  props: {
    type: {
      type: String,
      default: 'add',
    },
    catalogue: {
      type: Array,
      default: () => {
        return []
      },
    },
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    catalogueLine: {
      type: Array,
      default: () => {
        return []
      },
    },
    dataLine: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    getData() {
      this.$emit('getData', this.data)
    },
  },
}
</script>
<style lang="less">
.tableFrom {
  text-align: center;
  width: 100%;
  table-layout: fixed;
  line-height: 40px;
  tr,
  td {
    border: 1px #000 solid;
  }
  td {
    word-wrap: break-word;
    word-break: break-all;
  }
}
.input {
  border: 0;
  height: 40px !important;
}
.footer {
  margin-top: 10px;
}
</style>
