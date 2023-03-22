/*******
 *
 *  作业类型 -刘豪东
 *  2022.9.16
 *
 */
import requirt from '@/utils/request'

//获取作业列表
export  function getList(params) {
    return requirt({
        url: '/operationApplication/getListForPage',
        method: 'post',
        data: params,
    })
}
//获取作业类型字典表数据
export function getdict(params){
    return requirt({
        url: '/dict/dictList/ZYXKGL-ZYLX',
        method: 'get',
        params: params,
    })
}
// 作业许可统计
export function getstatistics(params){
  return requirt({
      url: '/queryCount',
      method: 'post',
      data: params,
  })
}
// 作业许可统计单位
export function getapplicant(params){
  return requirt({
      url: '/queryApplicant',
      method: 'post',
      data: params,
  })
}


//初始化多选框数据
export function getCheckBox(name,type){
    type?type:false;
    var  constData=JSON.stringify(require('../../static/data/chackBoxList.json'));
    var checkBoxDate= JSON.parse(constData);
    if(name){
        checkBoxDate["个人安全"].push(
            {
                label:'过滤式呼吸器',
                value:'过滤式呼吸器',
            },
            {
                label:'手套',
                value:'手套',
            },
        )
        for(var key in checkBoxDate){
            checkBoxDate[key].push({label:"其他",value:"其他"})
        }
        if(type==true){
            checkBoxDate[name].push({label:"注意事项",value:"注意事项"})
        }
    }
    return checkBoxDate
}
//获取措施
export function getMeasures(type){
    const testJson = require('../../static/data/measures.json')

    return type?testJson[type]:testJson
}
//获取措施
export function getMeasuresForm(type){
    var dataJson =JSON.stringify(require('../../static/data/measuresForm.json'))
    const testJson = JSON.parse(dataJson)
    return type?testJson[type]:testJson
}
// 获取许可证编码
export function getCreateNewId(params){
    return requirt({
        url: '/operationApplication/createNewId',
        method: 'post',
        params: params,
    })
}
// 添加许可证编码 jsa/insert
export function addOperationApplication(params){
    return requirt({
        url: '/operationApplication/addJsonWithAtt',
        method: 'post',
        data: params,
    })
}

// 获取作业申请详情 jsa/insert
export function getJsonByCode(params){
    return requirt({
        url: '/operationApplication/getJsonByCode',
        method: 'get',
        params: params,
    })
}
//修改作业申请详情 jsa/insert
export function updateJsonWithAtt(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/updateJsonWithAtt',
        method: 'post',
        data: params,
    })
}
//批量删除列表 jsa/deleteList
export function deleteList(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/delete',
        method: 'delete',
        data: params,
    })
}
//批量删除台账列表 jsa/deleteList
export function deleteForTZ(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/deleteForTZ',
        method: 'delete',
        data: params,
    })
}
//批量删除列表 jsa/deleteList
export function closeApply(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/closeApply',
        method: 'post',
        data: params,
    })
}
//批量删除列表 jsa/deleteList
export function addGltj(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/gltj',
        method: 'post',
        data: params,
    })
}
// 获取审批记录
export function getHistoryListWithSignImg(params){
  return requirt({
      // url: '/operationApplication/updateJson',
      url: '/workflow/historyListWithSignImg',
      method: 'get',
      params: params,
  })
}

// 流程提交
export function OperationApplicationSubmit(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/OperationApplicationSubmit',
        method: 'post',
        data: params,
    })
}
// /operationApplication/createCopy
//复制列表信息
export function createCopy(params){
    return requirt({
        // url: '/operationApplication/updateJson',
        url: '/operationApplication/createCopy',
        method: 'get',
        params: params,
    })
}
// /operationApplication/createCopy
//导出数据为EXCEL
export function getTZListForPage(params){
    return requirt({
        // url: '/operationApplication/exportXls',
        url: '/operationApplication/getTZListForPage',
        method: 'post',
        data: params,
    })
}

