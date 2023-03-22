/****
 * 编写人：刘豪东 2022年9月2号
 * table为空替换值为--
 * 用法在dc-table 标签里边 添加 :customRow="$tableRow"
 * 例子<dc-table :customRow="$tableRow"></dc-table>
 ****/
export function tableRow(row, index) {
  Object.keys(row).forEach(key => {
    if (!row[key]) {
      row[key] = '--'
    }
  })
  return
}

/*****
 * tableDta:数据源
 * infoKey:数据源下边的那个对象
 * key:infoKey 的那个key(label或value)
 * value:拼接的值
 * ****/
export function infoUpdata(tableData, infoKey, key, value) {
  if(value){
    tableData[infoKey].forEach(item => {
      if (item.value == key) {
        item.label += value
      }
    })
  }
  //操作逻辑
  return tableData
}

export function dataUpdata(data) {
  let dataVal;
  dataVal = data?data.split(","):'';
  return dataVal
}

// 特殊作业有效时间事件处理
export function getvalidTime(state,state1) {
    var funDatetimes="";
    if(state){
        var date = new Date(state);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear()< 10 ? '0'+date.getFullYear() : date.getFullYear();
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        var D = date.getDate()< 10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours()< 10 ? '0'+date.getHours() : date.getHours();
        var m = date.getMinutes()< 10 ? '0'+date.getMinutes() : date.getMinutes();

        funDatetimes=`自${Y}年${M}月${D}日${h}时${m}分始`;
        let dateTimes,endY,endM,endD,endh,endm
        dateTimes=state1.split(":");
        console.log(dateTimes)
        var workTime=(Math.abs(dateTimes[0])*3600000)+(Math.abs(dateTimes[1])*60000)
        var endDate = new Date(date*1+workTime)
        // var s = date.getSeconds()< 10 ? '0'+(date.getSeconds()+1) : date.getSeconds()+1;
        endY = endDate.getFullYear()< 10 ? '0'+endDate.getFullYear() : endDate.getFullYear();
        endM = (endDate.getMonth()+1 < 10 ?  '0'+(endDate.getMonth()+1) : endDate.getMonth()+1);
        endD = endDate.getDate()< 10 ? '0'+endDate.getDate() : endDate.getDate();
        endh = endDate.getHours()< 10 ? '0'+endDate.getHours() : endDate.getHours();
        endm = endDate.getMinutes()< 10 ? '0'+endDate.getMinutes() : endDate.getMinutes();
        funDatetimes+=`至${endY}年${endM}月${endD}日${endh}时${endm}分止`
    }
  return funDatetimes;
}
//获取当前时间 时间戳转时间
export function timestampToTime(timestamp) {
    var date = timestamp?new Date(timestamp):new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
    var h = (date.getHours()<10?'0'+date.getHours():date.getHours())+ ':';
    var m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
    var s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    return Y+M+D+h+m+s;
}
