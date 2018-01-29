//获取应用实例

var app = getApp()
var lineChart = null
var util = require('../../utils/util.js')
var wxCharts = require('../../js/wxcharts.js')

var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');

Page({
  data: {
    datetime: util.formatTime(new Date),
    hour: parseInt(util.formatHour(new Date)),
    date: util.formatDate(new Date),
    char_result: [],
    result: [],
    video_src: [],
    device_id: "",//当前设备名称
    HumidyCondition: "",
    pageBackgroundColor: "",
  },
 
  drawCircle: function () {
    clearInterval(varName);
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, 200, 200);
      ctx.draw();
      var x = 100, y = 100, radius = 90;
      ctx.setLineWidth(15);
      ctx.setStrokeStyle('#87CEFA');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
    var animation_interval = 1000, n = 60;
    var animation = function () {
      if (step <= n) {
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
      } else {
        clearInterval(varName);
      }
    };
    varName = setInterval(animation, animation_interval);

    //发送指令，开始浇水
    wx.sendSocketMessage({
      data: '{"type": "ChangeHumidity_open", "openid":"' + app.globalData.openid + '","device_id":"' + this.data.device_id + '"}',
    })

    //接收数据
    wx.onSocketMessage(function (res) {
      var str = res.data
      //console.log(str)
      // self.setData({
      //   result: JSON.parse(str),
      // })
    }),
    //连接失败
    wx.onSocketError(function () {
        console.log('websocket连接失败！');
    })
  },
  onReady: function () {
    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(15);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(100, 100, 90, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();

    
  },
  onLoad: function (options) {

    var self = this
    setInterval(function () {
      self.setData({
        datetime: util.formatTime(new Date),
      })
    }),

      self.setData({
        device_id: options.device_id
      })

    if (options.type < 50) {
      self.setData({
        HumidyCondition: "湿度过低",
        pageBackgroundColor: "http://47.95.246.160/images/t1.jpg"
      })
    }
    else {
      self.setData({
        HumidyCondition: "湿度适宜",
      })
    }
  },
})


