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
      <div style="width: 460px; color: #000">
        <!-- <span style="font-size: 12px"> 编码： </span> -->
        <h5
          style="
            font-size: 16px;
            text-align: center;
            margin-top: 10px;
            color: #000;
            font-weight: 900;
          "
        >
          变电站第一种工作票
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
              line-height: 22px;
              margin-bottom: 0px;
              color: #000;
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
                display: inline-block;
                vertical-align: middle;
                color: #000;
                vertical-align: bottom;
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
              line-height: 22px;
              margin-bottom: 0px;
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
          <span style="font-size: 12px; font-weight: 900; color: #000"
            >4.工作任务：</span
          >
          <table
            border="1"
            style="width: 460px; border-color: #000; border-style: solid"
          >
            <tr>
              <td
                style="
                  font-size: 12px;
                  font-weight: 900;
                  color: #000;
                  width: 230px;
                  text-align: center;
                "
              >
                工作地点及设备双重标准名称
              </td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 900;
                  color: #000;
                  width: 230px;
                  text-align: center;
                "
              >
                工作内容
              </td>
            </tr>
            <tr v-for="(item, index) in 2" :key="index">
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
          <span style="font-size: 12px; color: #000"
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
        <div style="margin-top: 5px">
          <span style="font-size: 12px; font-weight: 900; color: #000"
            >6.安全措施（必要时可附页绘图说明）：
          </span>
          <table
            border="1"
            style="width: 460px; border-color: #000; border-style: solid"
          >
            <tr v-for="(item, index) in 11" :key="index">
              <td style="height: 20px; font-size: 12px; text-align: center">
                {{ formData.csList[index]?.csName }}
              </td>
              <td style="height: 20px; font-size: 12px; text-align: center">
                {{ formData.csList[index]?.isExecute }}
              </td>
            </tr>
          </table>
          <table
            border="1"
            style="
              width: 460px;
              border-color: #000;
              border-style: solid;
              border-top: none;
            "
          >
            <tr>
              <td style="font-size: 12px">
                <span style="margin-left: 5px"
                  >工作地点保留带电部分或注意事项
                  <br />（由工作票签发人填写）</span
                >
              </td>
              <td style="font-size: 12px; margin-left: 10px">
                <span style="margin-left: 5px"
                  >补充工作地点保留带电部分和安全措施<br />（由工作许可人填写）</span
                >
              </td>
            </tr>
            <tr>
              <td style="height: 20px; font-size: 12px; text-align: center">
                {{ formData.attention }}
              </td>
              <td style="font-size: 12px"></td>
            </tr>
          </table>
          <span style="font-size: 12px; margin-left: 5px">
            <span style="font-weight: 900; color: #000"
              >工作票签发人签名：</span
            >
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                margin-right: 10px;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? dataSourceApproval[0].executorName
                  : ""
              }}</span
            >
            <span style="font-weight: 900; color: #000">签发日期：</span>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0].executeTime, 0)
                  : ""
              }}</span
            >
            年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
              "
            >
              {{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0].executeTime, 1)
                  : ""
              }}</span
            >
            月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
              "
            >
              {{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0].executeTime, 2)
                  : ""
              }}</span
            >
            日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0].executeTime, 3)
                  : ""
              }}</span
            >
            时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: center;
              "
              >{{
                dataSourceApproval.length > 0
                  ? splitTime(dataSourceApproval[0].executeTime, 4)
                  : ""
              }}</span
            >
            分
          </span>
        </div>
        <div style="margin-top: 5px">
          <span style="font-size: 12px"
            >7.收到工作票时间：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            ></span
            >年<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            ></span
            >月<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            ></span
            >日<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            ></span
            >时<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
              "
            ></span
            >分
          </span>
          <span style="display: block; font-size: 12px; margin-left: 5px"
            >运行值班人员签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 20px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                margin-right: 20px;
                width: 80px;
              "
            ></span
            >工作负责人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 20px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                width: 80px;
              "
            ></span
          ></span>
        </div>
      </div>
      <div
        style="width: 460px; margin-left: 20px; font-size: 12px; color: #000"
      >
        <div style="margin-top: 5px">
          <span style="font-size: 12px">8.确认本工作票1～7项： </span>
          <span style="font-size: 12px; display: block">
            工作负责人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 110px;
                margin: 0;
                vertical-align: bottom;
                margin-right: 20px;
              "
            ></span
            >工作许可人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 110px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
          </span>
          <span>
            许可开始工作时间：<span
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
        </div>

        <div style="margin-top: 5px">
          <span
            >9.确认工作负责人布置的任务和本施工项目安全措施（工作组人员签名）：</span
          >
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              margin-top: -16px;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              margin-top: -16px;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              margin-top: -16px;
            "
          ></span>
        </div>
        <div style="margin-top: 5px">
          <span style="display: block">10.工作负责人变动情况：</span>

          原工作负责人<span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 40px;
              margin: 0;
              vertical-align: bottom;
            "
          ></span
          >离去，变更<span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 60px;
              margin: 0;
              vertical-align: bottom;
            "
          ></span
          >为工作负责人
          <span style="display: block">
            工作票签发人：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 60px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                margin-left: 20px;
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
                width: 20px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >分
          </span>
          <span style="display: block"
            >工作人员变动情况（变动人员姓名、日期及时间）</span
          >

          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              margin-top: -16px;
            "
          ></span>
          <span
            style="
              border-bottom: solid 1px #000;
              display: inline-block;
              width: 100%;
              margin: 0;
              margin-top: -16px;
            "
          ></span>

          <span style="width: 100%; text-align: right; display: block">
            工作负责人签名：
            <span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:90px
                  margin: 0;
                  vertical-align: bottom;
                  margin-right: 10px;
                "
            ></span>
          </span>
        </div>
        <div style="display: block; margin-top: 5px">
          <span style="display: block">11.工作票延期</span>
          <span>
            有效期延长到<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:50px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >年<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >月<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >日<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >时<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
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
                  width:60px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                margin-left: 10px;
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
                width: 43px;
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
          <span style="display: block"
            >工作许可人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 60px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                margin-left: 10px;
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
            >日
            <span
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
            >分</span
          >
        </div>
        <div style="display: block; margin-top: 5px">
          <span>12.每日开工和收工时间（使用一天的工作票不必填写）</span>
          <table
            border="1"
            style="width: 460px; border-color: #000; border-style: solid"
          >
            <tr>
              <td style="text-align: center">收工时间</td>
              <td style="text-align: center; border-bottom: none; width: 60px">
                工作
              </td>
              <td style="text-align: center; border-bottom: none; width: 60px">
                工作
              </td>
              <td style="text-align: center">开工时间</td>
              <td style="text-align: center; border-bottom: none; width: 60px">
                工作
              </td>
              <td style="text-align: center; border-bottom: none; width: 60px">
                工作
              </td>
            </tr>
            <tr>
              <td style="width: 120px">
                <div style="width: 120px">
                  <span
                    style="
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    月</span
                  >
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    日</span
                  >
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    时</span
                  >
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    分</span
                  >
                </div>
              </td>
              <td style="text-align: center; border-top: none">负责人</td>
              <td style="text-align: center; border-top: none">许可人</td>
              <td style="width: 120px">
                <div style="width: 120px">
                  <span
                    style="
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    月</span
                  >
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    日</span
                  >
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    时</span
                  >
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                    分</span
                  >
                </div>
              </td>
              <td style="text-align: center; border-top: none">负责人</td>
              <td style="text-align: center; border-top: none">许可人</td>
            </tr>
            <tr>
              <td style="width: 120px">
                <div style="width: 120px">
                  <span
                    style="
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                </div>
              </td>
              <td style="text-align: center; border-top: none"></td>
              <td style="text-align: center; border-top: none"></td>
              <td style="width: 120px">
                <div style="width: 120px">
                  <span
                    style="
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                </div>
              </td>
              <td style="text-align: center; border-top: none"></td>
              <td style="text-align: center; border-top: none"></td>
            </tr>
            <tr>
              <td style="width: 120px">
                <div style="width: 120px">
                  <span
                    style="
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                </div>
              </td>
              <td style="text-align: center; border-top: none"></td>
              <td style="text-align: center; border-top: none"></td>
              <td style="width: 120px">
                <div style="width: 120px">
                  <span
                    style="
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                  <span
                    style="
                      border-left: solid 1px #000;
                      width: 25px;
                      text-align: center;
                      height: 22px;
                      display: inline-block;
                      vertical-align: bottom;
                    "
                  >
                  </span>
                </div>
              </td>
              <td style="text-align: center; border-top: none"></td>
              <td style="text-align: center; border-top: none"></td>
            </tr>
          </table>
        </div>
        <div style="display: block; margin-top: 5px">
          <span style="display: block">13.工作终结</span>
          <span>
            全部工作于<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >年<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >月<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >日<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >时<span
              style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width:40px
                  margin: 0;
                  vertical-align: bottom;
                "
            ></span
            >分结束，设备及安全措施已恢复至开工前状态，工作人员已全部撤离，材料工具已清理完毕，工作已终结。
          </span>
          <span style="display: block">
            工作负责人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 90px;
                margin: 0;
                margin-right: 20px;
                vertical-align: bottom;
              "
            ></span
            >工作许可人签名：<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 90px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
          </span>
        </div>
        <div style="display: block; margin-top: 5px">
          <span style="display: block">14.工作票终结</span>
          <span style="display: block">
            临时遮栏、标示牌已拆除，常设遮栏已恢复。
          </span>
          <span>
            未拆除或未拉开的接地线编号<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 140px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >共<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >组、接地刀闸（小车）<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 140px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >共<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 50px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >副（台），已汇报调度值班员。

            <span style="display: block"
              >工作许可人签名：<span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 50px;
                  margin: 0;
                  vertical-align: bottom;
                "
              ></span
              ><span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 40px;
                  margin: 0;
                  margin-left: 20px;
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
              >分</span
            >
          </span>
        </div>
        <div style="display: block">
          <span style="display: block">15.备注</span>
          <span style="display: block">
            （1）指定专责监护人<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 80px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span
            >负责监护<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 180px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
            <span style="display: block">
              <span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 320px;
                  margin: 0;
                  vertical-align: bottom;
                "
              ></span>
              （地点及具体工作）
            </span>
          </span>
          <span style="display: block">
            （2）其他事项<span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 340px;
                margin: 0;
                vertical-align: bottom;
              "
            ></span>
            <span style="display: block">
              <span
                style="
                  border-bottom: solid 1px #000;
                  display: inline-block;
                  width: 420px;
                  margin: 0;
                  vertical-align: bottom;
                "
              ></span>
            </span>
          </span>
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
  name: 'firstWorkTicket',
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
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
      dataSourceApproval: [],
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
<style media="print">
@page {
  size: landscape;
  margin: 0.5rem;
  margin-top: 30px;
}
</style>