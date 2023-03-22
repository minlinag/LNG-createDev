<template>
  <div style="border: solid 1px #000; padding-bottom: 20px">
    <div
      id="printContent"
      style="
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
      "
    >
      <div style="width: 460px; font-size: 12px; color: #000">
        <h5
          style="
            font-size: 16px;
            text-align: center;
            margin-top: 10px;
            color: #000;
            font-weight: 900;
          "
        >
          变电站第二种工作票
        </h5>
        <div>
          <div style="display: inline-block">
            <p
              style="
                display: inline-block;
                margin-bottom: 2px;
                font-size: 12px;
                font-weight: 900;
                color: #000;
              "
            >
              单位：
            </p>
            <p
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 150px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                color: #000;
              "
            >
              {{ formData.company }}
            </p>
          </div>
          <div style="float: right">
            <p
              style="
                display: inline-block;
                margin-bottom: 2px;
                font-size: 12px;
                font-weight: 900;
                color: #000;
              "
            >
              编号：
            </p>
            <p
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 150px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                color: #000;
              "
            >
              {{ formData.codeNo }}
            </p>
          </div>
        </div>
        <div style="margin-top: 5px">
          <span style="font-size: 12px; color: #000">
            <span style="font-weight: 900">1.工作负责人（监护人）：</span>
            <p
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            >
              {{ formData.responsibleUser }}
            </p>
          </span>
          <span style="font-size: 12px; margin-left: 18px; color: #000">
            <span style="font-weight: 900">班组：</span>
            <p
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 147px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            >
              {{ formData.classTeam }}
            </p></span
          >
        </div>
        <div style="position: relative; margin-top: 5px">
          <span style="font-size: 12px; font-weight: 900; color: #000"
            >2.工作班人员（不包括工作负责人）：</span
          >

          <p
            style="
              position: absolute;
              width: 460px;
              font-size: 12px;
              text-indent: 24px;
              line-height: 18px;
              margin-bottom: 0px;
              margin-top: 0px;
            "
          >
            {{ formData.teamMember }}
          </p>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              font-size: 12px;
              color: #000;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
              font-size: 12px;
              color: #000;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
              font-size: 12px;
              color: #000;
            "
          ></span>
          <div>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: calc(100% - 80px);
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                color: #000;
              "
            ></span>
            <span
              style="
                font-size: 12px;
                vertical-align: bottom;
                display: inline-block;
                vertical-align: middle;
                color: #000;
              "
              >共<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 40px;
                  margin: 0;
                  font-size: 12px;
                  text-align: center;
                  color: #000;
                "
                >{{ formData.totalPeople }}</span
              >人</span
            >
          </div>
        </div>
        <div style="position: relative; margin-top: 5px">
          <span style="font-size: 12px; font-weight: 900; color: #000"
            >3.工作的变配电站名称及设备双重名称：</span
          >
          <p
            style="
              position: absolute;
              width: 460px;
              font-size: 12px;
              text-indent: 24px;
              line-height: 18px;
              margin-bottom: 0px;
              margin-top: 0px;
            "
          >
            {{ formData.stationEqmName }}
          </p>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
              font-size: 12px;
            "
          ></span>
        </div>
        <div style="margin-top: 5px">
          <span style="font-size: 12px; font-weight: 900">4.工作任务：</span>
          <table
            border="1"
            style="width: 460px; border-color: #000; border-style: solid"
          >
            <tr>
              <td
                style="
                  font-size: 12px;
                  text-align: center;
                  font-weight: 900;
                  width: 230px;
                "
              >
                工作地点或地段
              </td>
              <td
                style="
                  font-size: 12px;
                  text-align: center;
                  font-weight: 900;
                  width: 230px;
                "
              >
                工作内容
              </td>
            </tr>
            <tr v-for="(item, index) in 7" :key="index">
              <td style="height: 20px; font-size: 12px; text-align: center">
                {{ formData.bzList[index]?.content1 }}
              </td>
              <td style="height: 20px; font-size: 12px; text-align: center">
                {{ formData.bzList[index]?.content2 }}
              </td>
            </tr>
          </table>
        </div>
        <div style="margin-top: 5px">
          <span style="font-size: 12px"
            ><span style="font-weight: 900">5.计划工作时间：</span>
            <span
              >自<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 40px;
                  margin: 0;
                  vertical-align: bottom;
                  font-size: 12px;
                  text-align: center;
                  line-height: 16px;
                "
                >{{ splitTime(formData.startRunTime, 0) }}</span
              >年<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 25px;
                  margin: 0;
                  vertical-align: bottom;
                  font-size: 12px;
                  text-align: center;
                  line-height: 16px;
                "
                >{{ splitTime(formData.startRunTime, 1) }}</span
              >月<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 25px;
                  margin: 0;
                  vertical-align: bottom;
                  font-size: 12px;
                  text-align: center;
                  line-height: 16px;
                "
                >{{ splitTime(formData.startRunTime, 2) }}</span
              >日<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 25px;
                  margin: 0;
                  vertical-align: bottom;
                  font-size: 12px;
                  text-align: center;
                  line-height: 16px;
                "
                >{{ splitTime(formData.startRunTime, 3) }}</span
              >时<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 25px;
                  margin: 0;
                  vertical-align: bottom;
                  font-size: 12px;
                  text-align: center;
                  line-height: 16px;
                "
              >
                {{ splitTime(formData.startRunTime, 4) }}</span
              >分
            </span>
          </span>
          <span style="display: block; font-size: 12px; margin-left: 97px"
            >至<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
              "
              >{{ splitTime(formData.endRunTime, 0) }}</span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
              "
              >{{ splitTime(formData.endRunTime, 1) }}</span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
              "
              >{{ splitTime(formData.endRunTime, 2) }}</span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
              "
              >{{ splitTime(formData.endRunTime, 3) }}</span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
              "
              >{{ splitTime(formData.endRunTime, 4) }} </span
            >分
          </span>
        </div>
        <div style="margin-top: 5px; position: relative">
          <span style="font-weight: 900"
            >6. 工作条件（停电或不停电，或临近及保留带电设备名称）
          </span>
          <p
            style="
              position: absolute;
              width: 460px;
              font-size: 12px;
              text-indent: 24px;
              line-height: 18px;
              margin-bottom: 0px;
              margin-top: 0px;
            "
          >
            {{ formData.conditions }}
          </p>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
        </div>
        <div style="margin-top: 5px; position: relative">
          <span>
            <span style="font-weight: 900">7.注意事项（安全措施）：</span>
            <p
              style="
                position: absolute;
                width: 460px;
                font-size: 12px;
                text-indent: 150px;
                line-height: 18px;
                margin-bottom: 0px;
                margin-top: -17px;
              "
            >
              {{ formData.attention }}
            </p>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 305px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100%;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100%;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100%;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
          </span>
          <span style="display: block"
            ><span style="font-weight: 900">工作票签发人签名：</span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 50px;
                margin: 0;
                margin-right: 10px;
                vertical-align: bottom;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? dataSourceApproval[0].executorName
                  : ""
              }}</span
            ><span style="font-weight: 900">签发日期：</span>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0]?.executeTime, 0)
                  : ""
              }}</span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0]?.executeTime, 1)
                  : ""
              }}</span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0]?.executeTime, 2)
                  : ""
              }}</span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0]?.executeTime, 3)
                  : ""
              }}</span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0]?.executeTime, 4)
                  : ""
              }}</span
            >分
          </span>
        </div>
      </div>
      <div
        style="width: 460px; margin-left: 20px; font-size: 12px; color: #000"
      >
        <div style="margin-top: 5px">
          <span>8.补充安全措施（工作许可人填写） </span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
        </div>

        <div style="margin-top: 5px">
          <span>9. 确认本工作票1～8项 </span>
          <span style="display: block">
            许可开始工作时间：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 120px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
            年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >分
          </span>
          <span style="display: block">
            工作负责人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 120px;
                margin: 0;
                margin-right: 20px;
                vertical-align: bottom;
              "
            ></span
            >工作许可人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 120px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
          </span>
        </div>
        <div style="margin-top: 5px">
          <span>10.确认工作负责人布置的任务和本施工项目安全措施</span>
          <span style="display: block"> 工作组人员签名： </span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
        </div>
        <div style="display: block; margin-top: 5px">
          <span>11.工作票延期</span>
          <span style="display: block">
            有效期延长到<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >分
          </span>
          <span style="display: block">
            工作负责人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100px;
                margin: 0;
                margin-right: 20px;
                vertical-align: bottom;
              "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 50px;
                margin: 0;
                margin-left: 4px;
                vertical-align: bottom;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >时<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:30px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >分
          </span>
          <span style="display: block"
            >工作许可人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100px;
                margin: 0;
                margin-right: 20px;
                vertical-align: bottom;
              "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 50px;
                margin: 0;
                margin-left: 4px;
                vertical-align: bottom;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日
            <span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:30px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >时<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:30px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >分</span
          >
        </div>
        <div style="display: block; margin-top: 5px">
          <span>12.工作票终结</span>
          <span>
            全部工作于<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >分结束，工作人员已全部撤离，材料工具已清理完毕。
          </span>
          <span style="display: block">
            工作负责人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100px;
                margin: 0;
                margin-right: 20px;
                vertical-align: bottom;
              "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 50px;
                margin: 0;
                margin-left: 4px;
                vertical-align: bottom;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >分
          </span>
          <span style="display: block"
            >工作许可人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 100px;
                margin: 0;
                margin-right: 20px;
                vertical-align: bottom;
              "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 50px;
                margin: 0;
                margin-left: 4px;
                vertical-align: bottom;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >日
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 30px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >分</span
          >
        </div>
        <div style="display: block; margin-top: 5px">
          <span style="display: block">13.备注</span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              vertical-align: bottom;
            "
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  historyList,
} from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
export default {
  name: 'secondWorkTicket',
  props: {
    formData: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  watch: {
    formData: {
      handler(val) {
        if (val.id) {
          this.getDataSourceApproval(val.id)
        }

      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      dataSourceApproval: []
    }
  },
  created() { },
  methods: {
    splitTime(time, index) {
      if (time) {
        let timeArr = time.split(/[- :]/);
        return timeArr[index]
      }
      // 2023-02-15 14:38:57 转化  [2023,02,15,14,38,57]

    },
    //审批历史列表
    getDataSourceApproval(id) {
      historyList({ businessId: id }).then((res) => {
        this.dataSourceApproval = res.body.data || []
        this.dataSourceApproval.forEach((item, index) => {
          item.id = index
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>
