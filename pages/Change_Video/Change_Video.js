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
    device_id: ""//当前设备名称
  },


  touchHandler: function (e) {
    //console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },
  onLoad: function (options) {
    // console.log(options.id)
    var self = this
    setInterval(function () {
      self.setData({
        datetime: util.formatTime(new Date),
      })
    })

    self.setData({
      device_id: options.id
    })

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
  //播放视频
  getVideo: function () { //视频下载
    var self = this
    self.setData({
      video_src: 'http://47.95.246.160:10022/hls/mystream.m3u8'
      //'http://192.168.1.6:8080/hls/test.m3u8'
    })
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:');
    console.log(e.detail.errMsg);
  },
};
Page(pageConfig);

// 获取页面堆栈，表示历史访问过的页面，最后一个元素为当前页面
const page = getCurrentPages();


