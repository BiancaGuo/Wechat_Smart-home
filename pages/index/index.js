//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '植物生长检测系统',
    //userInfo: {}
  },
  
  //事件处理函数
  // ChooseTemperature: function(e) {
  //   wx.navigateTo({
  //     url: '../temperature/temperature'
  //   })
  // },
  // ChooseHumidity: function() {
  //   wx.navigateTo({
  //     url: '../humidity/humidity'
  //   })
  // },
  //  ChoosePM: function() {
  //   wx.navigateTo({
  //     url: '../pm/pm'
  //   })
  // },
   ChooseRoom: function(e) {
    wx.navigateTo({
      url:'../Environmental_indicators/Environmental_indicators'//修改
     // url:'../123/123'
    })
  },

  MyPlant: function (e) {
     wx.navigateTo({
       url: '../Choose_Plant/Choose_Plant'//修改
       // url:'../123/123'
     })
   },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

    wx.connectSocket({
      url: 'ws://47.95.246.160:8282',
    })
    //连接成功
    wx.onSocketOpen(function () {
      console.log('websocket opened.');
    })
    // wx.login({
    //   success: function () {
    //     wx.getUserInfo({
    //       success: function (res) {
    //         var simpleUser = res.userInfo;
    //         console.log(simpleUser.nickName);
    //       }
    //     });
    //   }
    // })
  }
})
