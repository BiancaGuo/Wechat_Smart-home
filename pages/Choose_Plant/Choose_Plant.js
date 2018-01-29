//humidity.js
var app = getApp()
var lineChart = null
var util = require('../../utils/util.js')
var wxCharts = require('../../js/wxcharts.js')


let pageConfig = {
  data: {
    hiddenmodalput: true,
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
    datetime: util.formatTime(new Date),
    hour: parseInt(util.formatHour(new Date)),
    date: util.formatDate(new Date),
    result: [],//初始获得的结果（设备个数和设备标识）
    NewPlantID:[],//添加的新设备名称
    // newPlant:[],
    userInfo:[],//用户信息
    // PlantNum:[],
    condition1:false,
    condition2:false,
    condition3:false,
    device_name_1:"",
    device_name_2:"",
    device_name_3:""
  },

  //页面加载  
  onLoad: function () {
    var self = this

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      self.setData({
        userInfo: userInfo
      })
    })
    //console.log(self.data.userInfo.nickName)
    /*WebSocket与服务器端实时交换数据*/
    //建立连接
    // var num = this.data.NewPlantID
    // var name = this.data.userInfo.openid
    // console.log(name)
    //连接成功
    // wx.onSocketOpen(function () {
    //   console.log('websocket opened.');
    //   wx.sendSocketMessage({
    //     data: '{ openid:"' + app.globalData.openid + '"}'
    //   })
    // })
    wx.sendSocketMessage({
        data: '{"type":"login","openid":"' + app.globalData.openid + '"}'
    })
    //接收数据
    wx.onSocketMessage(function (res) {
      var str = res.data
      self.setData({
        result: JSON.parse(str),
      })
      console.log(self.data.result)
      if (self.data.result.device_num > 0)//接收到正确数据
      {
        
        for (var i = 0; i < self.data.result.device_num; i++) {
          var PlantCondition = "condition" + (i + 1).toString();
          var device_num = "device_name_" + (i + 1).toString();
          // console.log(PlantCondition)
          self.setData({
            [PlantCondition]:true,
            // [device_name]:
          })
          // console.log(self.data.condition1)
          // console.log(self.data.condition2)
          // console.log(self.data.condition3)
          // var cb = self.data.newPlant;
          // cb.push(self.data.newPlant.length);
          // self.setData({
          //   newPlant: cb,
          //   PlantNum:"device_id_"+(i+1).toString()
          // })
        }

        if (self.data.result.device_num==1)
        {
          self.setData({
            device_name_1: self.data.result.device_id_1
          })
        }
        if (self.data.result.device_num == 2) {
          self.setData({
            device_name_1: self.data.result.device_id_1,
            device_name_2: self.data.result.device_id_2
          })
        }
        if (self.data.result.device_num == 3) {
          self.setData({
            device_name_1: self.data.result.device_id_1,
            device_name_2: self.data.result.device_id_2,
            device_name_3: self.data.result.device_id_3
          })
        }
      }
      // wx.closeSocket()
    })


    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })



  },


  //指定的AddPlant弹出框
  AddPlant: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  NumberInput: function (e) {
    this.setData({
      // Number: '{num:"'+e.detail.value+'"}'
      NewPlantID: e.detail.value
    })
   
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },

  ChoosePlant: function (e) {
    console.log(e.target.id)
    var id = e.target.id

    if (id =="device_id_1")
    {
      wx.navigateTo({
        url: '../Environmental_indicators/Environmental_indicators?id=' + this.data.result.device_id_1//修改
        // url:'../123/123'
      })
    }
    else if (id == "device_id_2")
    {
      wx.navigateTo({
        url: '../Environmental_indicators/Environmental_indicators?id=' + this.data.result.device_id_2//修改
        // url:'../123/123'
      })
    }
    else if (id == "device_id_3") 
    {
      wx.navigateTo({
        url: '../Environmental_indicators/Environmental_indicators?id=' + this.data.result.device_id_3//修改
        // url:'../123/123'
      })

    }
    
  },


  confirm: function () {
    var self = this
    this.setData({
      hiddenmodalput: true
    })
    //获得设备编号：console.log(this.data.NewPlantID)

    /*WebSocket与服务器端实时交换数据*/
    //建立连接
    // wx.connectSocket({   
    //   url:'ws://47.95.246.160:2000',
    // })

    if (self.data.result.device_num>=3)//绑定设备上限设置
    {
      wx.showModal({
        title: '设备添加失败',
        content: '当前账号绑定设备已达上限！',
        showCancel: 'false',
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      })
    }
    else
    {
      
      var num = this.data.NewPlantID
      // var name=that.globalData.userInfo.nickname
      // console.log(name);
      //连接成功
      // wx.onSocketOpen(function () {

      //   console.log('websocket opened.');
      //   console.log(self.data.NewPlantID);
      wx.sendSocketMessage({
        data: '{"type":"add","openid":"' + app.globalData.openid + '","NewPlantNum":"'+num+'"}'
      })
      // })
      //接收数据
      wx.onSocketMessage(function (res) {
        // console.log("连接成功！")
        var str = res.data
        console.log(str)
        // self.setData({
        //   result: JSON.parse(str),
        // })
        // console.log(self.data.result)
        if (str[0] == "Y")//接收到正确数据
        {
          wx.showModal({
            title: '添加成功！',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })

          var PlantNumber = self.data.result.device_num
          if (PlantNumber==0)
          {
            self.setData({
              condition1: true,
              device_name_1: num
            })
          }
          else if (PlantNumber == 1)
          {
            self.setData({
              condition2: true,
              device_name_2: num
            })
          }
          else
          {
            self.setData({
              condition3: true,
              device_name_3: num
            })
          }
          
          //设备数加一
          self.data.result.device_num = self.data.result.device_num + 1
          // var cb = self.data.newPlant;
          // cb.push(self.data.newPlant.length);
          // self.setData({
          //   newPlant: cb
          // })
        }
        else 
        {
          wx.showModal({
            title: '设备错误！',
            content: '未找到指定设备，请重新添加!',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })
        }

        // wx.closeSocket()
      })


      wx.onSocketError(function () {
        console.log('websocket连接失败！');
      })

      wx.onSocketClose(function (res) {
        console.log('WebSocket 已关闭！')
      })
    }
  }
    
};


Page(pageConfig);
// 获取页面堆栈，表示历史访问过的页面，最后一个元素为当前页面
// const page = getCurrentPages();
// // 获取页面堆栈，表示历史访问过的页面，最后一个元素为当前页面
// const page = getCurrentPages();


