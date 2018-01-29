//humidity.js
var app = getApp()
var lineChart = null
var util = require('../../utils/util.js')
var wxCharts = require('../../js/wxcharts.js')


let pageConfig = {
  data: {
    datetime: util.formatTime(new Date),
    hour: parseInt(util.formatHour(new Date)),
    date: util.formatDate(new Date),
    char_result: [],
    result: [],
    video_src: [],
    device_id: "",//当前设备名称
    LightCondition: "",
    pageBackgroundColor: "",
    switchChecked: false,
    light_status:0
  },

  onLoad: function (options) {
    var self = this
    setInterval(function () {
      self.setData({
        datetime: util.formatTime(new Date),
        
      })

    },
    )
    self.setData({
      device_id: options.device_id,
      light_status: options.light_status
    })

    console.log(options.light_status)

    if (options.light_status==0)
    {
      self.setData({
        switchChecked: false
      })
    }
    else
    {
      self.setData({
        switchChecked: true
      })
    }
    if (options.type == 0) {
      self.setData({
        LightCondition: "光照过低",
        pageBackgroundColor: "http://47.95.246.160/images/t1.jpg"
      })
    }
    else {
      self.setData({
        LightCondition: "光照适宜",
      })
    }
    //给服务器端发送消息
    // wx.sendSocketMessage({
    //   data: '',
    // })

    //接收数据
    // wx.onSocketMessage(function (res) {
    //   var str = res.data
    //   //console.log(str)
    //   // self.setData({
    //   //   result: JSON.parse(str),
    //   // })
    // }),

    //连接失败
    // wx.onSocketError(function () {
    //     console.log('websocket连接失败！');
    // })
  },

  ChangeLight: function (e) {
    let self = this
    // console.log(e.detail.value);//true or false
    if (e.detail.value == true) {
      wx.sendSocketMessage({
        data: '{"type": "ChangeLight_open", "openid":"' + app.globalData.openid + '","device_id":"' + this.data.device_id + '"}'
      })
      wx.onSocketMessage(function (res) {
        console.log("连接成功！")
        var str = res.data
        console.log(str)
        if (str[0] != "Y")//接收到正确数据
        {
          wx.showModal({
            title: '开启失败',
            content: '',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })
          self.setData({
            switchChecked: false
          })
          // wx.closeSocket()
          //控制switch关闭
        }
        else {
          self.setData({
            switchChecked: true
          })
        }
      })
    }
    if (e.detail.value == false) {
      wx.sendSocketMessage({
        data: '{"type": "ChangeLight_close", "openid":"' + app.globalData.openid + '","device_id":"' + this.data.device_id + '"}'
      })
      wx.onSocketMessage(function (res) {
        // console.log("连接成功！")
        var str = res.data
        console.log(str)
        if (str[0] != "Y")//接收到正确数据
        {
          wx.showModal({
            title: '关闭失败',
            content: '',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })
          // wx.closeSocket()
          self.setData({
            switchChecked: true
          })
        }
        else {
          self.setData({
            switchChecked: false
          })
        }
      })

    }
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


};
Page(pageConfig);

// 获取页面堆栈，表示历史访问过的页面，最后一个元素为当前页面
const page = getCurrentPages();


