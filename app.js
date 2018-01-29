//app.js
App({
  data: {
    
  },
  globalData: {
    nickname: [],
    openid: []
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo)
    {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else
    {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })

          if(res.code){
            console.log(111)
            //获取openId
            var _this=this
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                //小程序唯一标识
                appid: 'wxa99382027ecf9e0e',
                //小程序的 app secret
                secret: '877841122ec0009f27385eec440e186c',
                grant_type: 'authorization_code',
                js_code: res.code
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (openIdRes) {
                // console.info("登录成功返回的openId：" + openIdRes.data.openid);
                that.globalData.openid=openIdRes.data.openid;
                console.info("登录成功返回的openId：" + that.globalData.openid);

                
              },
              fail: function (error) {
                console.info("获取用户openId失败");
                console.info(error);
              }
            })
          }
         
        }
      })
    }
  },

  onUnload: function () {
    // 页面关闭
    wx.closeSocket()
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })

  },
  globalData:{
    userInfo:null
  }
})

