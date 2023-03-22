<template>
  <div>
    <div class="form_piece_title">
      <span>年度考核记录</span>
    </div>
    <a-table
      :scroll="{ y: 300, x: 300 }"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource"
      :openSelector="true"
      class="file_list multi_line"
    >
      <!-- <template slot="footer">年度考核总分：{{ yearScoreTotal }} </template> -->
    </a-table>
  </div>
</template>
<script>
export default {
  name: "annualAssessmentRecord",
  props: [
    'list',
    'checkForm',
  ],
  data() {
    return {
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return {
              children: `${index == this.dataSource.length - 1 ? '合计' : index + 1}`,
              attrs: { rowSpan: 1 },
            };
          }
          ,
          width: 80,
        }, {
          title: "责任制内容",
          dataIndex: "content",
          width: 250
        }, {
          title: "责任制清单",
          dataIndex: "dutyChecklist",
          width: 250
        }, {
          title: "考核标准",
          dataIndex: "assessStandard",
          width: 250
        }, {
          title: '扣分',
          dataIndex: "listScoresTotal",
          width: 80,
        }
      ],
      dataSource: [],
      yearScoreTotal: 0
    };
  },
  watch: {
    list: {
      handler(val) {
        if (val.length > 0) {
          this.columns = [
            {
              title: '序号',
              customRender: (text, record, index) => {
                return {
                  children: `${index == this.dataSource.length - 1 ? '扣分' : index + 1}`,
                  attrs: { rowSpan: 1 },
                };
              }
              ,
              width: 80,
            }, {
              title: "责任制内容",
              dataIndex: "content",
              width: 100
            }, {
              title: "责任制清单",
              dataIndex: "dutyChecklist",
              width: 100
            }, {
              title: "考核标准",
              dataIndex: "assessStandard",
              width: 100
            }, {
              title: '备注',
              dataIndex: "remark",
              width: 200,
              ellipsis: true

            }, {
              title: '合计',
              dataIndex: "listScoresTotal",
              width: 80
            }
          ]
          let date = new Date();
          let currentYear = date.getFullYear();
          let newList = this.list.map((item) => {

            let newItem = this.$lodash.cloneDeep(item);
            newItem.list = []

            for (let index = 0; index < item.list.length; index++) {
              const element = this.objKeySort(item.list[index]);
              if (Object.keys(element)[0].split("-")[0] == currentYear) {
                newItem.list.push(element)
              }
            }
            return newItem
          })
          this.dataSource = []
          this.columns.splice(4, 0, ...this.getTableTime(newList[0].list));
          this.dataSource = this.recombineSource(newList)
        }
      },
      immediate: true
    },
  },
  methods: {
    objKeySort(arys) {
      //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获	取的属性名进行排序，newkey是一个数组
      var newkey = Object.keys(arys).sort();
      //console.log('newkey='+newkey);
      var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]];  //向新创建的对象中按照排好的顺序依次增加键值对   
      }
      return newObj; //返回排好序的新对象
    },
    getTableTime(list) {
      // for (let index = 0; index < list.length; index++) {
      //   const element = list[index];
      // }
      let newList = list.sort((a, b) => {
        let newA = Object.keys(a)[0]
        let newB = Object.keys(b)[0]
        return newA > newB ? 1 : -1
      })
      let then = this
      let tableTimeList = newList.map((item, index) => {
        return {
          title: Object.keys(item)[0] == "remark" ? Object.keys(item)[1] : Object.keys(item)[0],
          dataIndex: then.numbersToAlphabets((Object.keys(item)[0] == "remark" ? Object.keys(item)[1] : Object.keys(item)[0]) + index),
          width: 100
        }
      })
      return tableTimeList
    },
    recombineSource(list) {
      let totalRow = {}
      let data = list.map((item, i) => {
        let newItem = item
        newItem.listScoresTotal = 0
        for (let index = 0; index < item.list.length; index++) {
          const element = item.list[index];
          if (i !== 0) {
            for (let ind = 0; ind < list[0].list.length; ind++) {
              const e = list[0].list[ind];
              if (Object.keys(element)[0] === Object.keys(e)[0]) {
                newItem[this.numbersToAlphabets(Object.keys(element)[0] + ind)] = element[Object.keys(element)[0]]
                newItem.remark = `${newItem.remark ? newItem.remark : ''}${Object.keys(element)[0]}:${element.remark ? element.remark : ""};`
                totalRow[this.numbersToAlphabets(Object.keys(element)[0] + ind)] += this.stringConvertNumber(element[Object.keys(element)[0]])
                newItem.listScoresTotal += this.stringConvertNumber(element[Object.keys(element)[0]])
              }
            }
          } else {
            newItem[this.numbersToAlphabets(Object.keys(element)[0] + index)] = element[Object.keys(element)[0]]
            newItem.remark = `${newItem.remark ? newItem.remark : ''}${Object.keys(element)[0]}:${element.remark ? element.remark : ""};`
            totalRow[this.numbersToAlphabets(Object.keys(element)[0] + index)] = this.stringConvertNumber(element[Object.keys(element)[0]])
            newItem.listScoresTotal += this.stringConvertNumber(element[Object.keys(element)[0]])
          }
        }

        return newItem
      })
      let yearScoreTotal = 0
      for (const key in totalRow) {
        if (Object.hasOwnProperty.call(totalRow, key)) {
          const element = totalRow[key];
          yearScoreTotal += element
        }
      }
      totalRow.listScoresTotal = 1000 - yearScoreTotal
      data.push(totalRow)
      return data
    },
    numbersToAlphabets(numbers) {
      let arr = numbers.split('-');
      let numbersResult = arr.join('');
      let numbersArr = numbersResult.split('');
      let result = '';
      for (var i = 0; i < numbersArr.length; i++) {
        if (numbersArr[i] === '0') {
          result += 'a';
        } else if (numbersArr[i] === '1') {
          result += 'b';
        } else if (numbersArr[i] === '2') {
          result += 'c';
        } else if (numbersArr[i] === '3') {
          result += 'd';
        } else if (numbersArr[i] === '4') {
          result += 'e';
        } else if (numbersArr[i] === '5') {
          result += 'f';
        } else if (numbersArr[i] === '6') {
          result += 'g';
        } else if (numbersArr[i] === '7') {
          result += 'h';
        } else if (numbersArr[i] === '8') {
          result += 'i';
        } else if (numbersArr[i] === '9') {
          result += 'j';
        }
      }
      return result
    },
    stringConvertNumber(val) {
      let newVal = parseFloat(val)
      if (newVal % 1 === 0) {
        newVal = parseInt(newVal)
      }
      return newVal
    }
  },
};
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
  ::v-deep .ant-table-footer {
    padding: 6px 17px;
    text-align: right;
  }
}
</style>
