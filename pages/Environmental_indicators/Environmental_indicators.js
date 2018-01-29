//humidity.js
var app = getApp()
var lineChart = null
var util = require('../../utils/util.js')
var wxCharts = require('../../js/wxcharts.js')


let pageConfig = {
  data:{
    datetime:util.formatTime(new Date),
    hour:parseInt(util.formatHour(new Date)),
    date:util.formatDate(new Date),
    char_result:[],//温湿度（时间：数据）
    result: [],//当前设备的温度、湿度、光照情况、灯的开关情况、风扇的开关情况
    video_src: [],
    test:[],
    device_id:"",//当前设备名称
    charname:"查看湿度曲线",
    condition1:true,
    condition2:false
  },
  
  createSimulationData: function () {
    var self = this;
    // console.log(self.data.char_result)
    var categories = [];
    var data = [];
    var h = parseInt(util.formatHour(new Date));
    for (var i = h - 6; i <= h; i++) {
      categories.push((i) + 'h');
      data.push(parseInt(this.data.char_result.temperature[i]));
    }
    return {
      categories: categories,
      data: data
    }
  },


  createSimulationData2: function () {
    var self = this;
    var categories = [];
    var data = [];
    var h = parseInt(util.formatHour(new Date));
    for (var i = h - 6; i <= h; i++) {
      categories.push((i) + 'h');
      data.push(parseInt(this.data.char_result.humidity[i]));
    }
    return {
      categories: categories,
      data: data
    }
  },

  ChangeChar:function(e)
  {
    var self=this;
    if (self.data.charname =="查看湿度曲线")
    {
      self.setData({
        charname: "查看温度曲线",
        condition1: false,
        condition2: true
      })

      var simulationData2 = this.createSimulationData2();
      lineChart = new wxCharts({
        canvasId: 'HumidityCanvas',
        type: 'line',
        categories: simulationData2.categories,
        animation: true,
        legend: true,
        background: '#f5f5f5',
        series: [{
          name: '湿度曲线图',
          data: simulationData2.data,
          format: function (val, name) {
            return val.toFixed(2) + "%";
          }
        },],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '湿度 （%）',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: 320,
        height: 250,
        dataLabel: false,
        dataPointShape: true,

        extra: {
          lineStyle: 'curve'
        }

      })

      

      
    }
    else
    {
      self.setData({
        charname: "查看湿度曲线",
        condition1: true,
        condition2: false,
      })
    }
    
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'TemperatureCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      legend: true,
      background: '#f5f5f5',
      series: [{
        name: '温度曲线图',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '℃';
        }
      },],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '温度 (℃)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 320,
      height: 250,
      dataLabel: false,
      dataPointShape: true,

      extra: {
        lineStyle: 'curve'
      }

    })
  },
  touchHandler: function (e) {
        //console.log(lineChart.getCurrentDataIndex(e));
      lineChart.showToolTip(e, {
            // background: '#7cb5ec'
        });
  },    
  
  onLoad:function(options){
    // console.log(options.id)
    var self=this
    setInterval(function(){
      self.setData({
        datetime:util.formatTime(new Date),
      })

    },)
    self.setData({
      device_id: options.id
    })
    wx.sendSocketMessage({
      data: '{"type":"everyplant","openid":"' + app.globalData.openid + '","device_id":"' + self.data.device_id +'"}'
    })
    wx.sendSocketMessage({
      data: '{"type":"Diagram","openid":"' + app.globalData.openid + '","device_id":"' + self.data.device_id + '"}'
    })

    //接收数据
    wx.onSocketMessage(function(res) { 
      var str =   res.data 
      // console.log(str)
      self.setData({
        test:JSON.parse(str),
      })
      if (self.data.test.type!="period")
      {
        self.setData({
          result: self.data.test
        })
        //弹出警告
        //发出温度警告 
        if (self.data.result.humidity > 20) {
          console.log(self.data.result.humidity)
          wx.showModal({
            title: '湿度报警',
            content: '当前湿度已达到' + self.data.result.humidity + ',' + '请注意!',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })
        }

        if (self.data.result.temperature > 30) {
          console.log(self.data.result.temperature)
          wx.showModal({
            title: '温度报警',
            content: '当前温度已达到' + self.data.result.temperature + ',' + '请注意!',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })
        }

        if (self.data.result.co2 > 2000) {
          console.log(self.data.result.co2)
          wx.showModal({
            title: 'CO2浓度报警',
            content: '当前CO2浓度已达到' + self.data.result.co2 + ',' + '请注意!',
            showCancel: 'false',
            confirmText: '我知道了',
            confirmColor: '#3CC51F'
          })
        }
        console.log(self.data.result)

      }
      else
      {
        self.setData({
          char_result: self.data.test
        })
        // console.log(self.data.char_result)
      }
    })

    
    //连接失败
    wx.onSocketError(function() {
      console.log('websocket连接失败！');
    })      
   
  },

  //////////////////////////////////////////////////////////////////

  

  /////////////////////////////////////////////////////////////////
  onReady:function(){
    var self = this
    // console.log(self.data.char_result)
    // 页面渲染完成
    //画图
    ///////////////////温度曲线///////////////////////////////
    var simulationData = this.createSimulationData();
    lineChart=new wxCharts({
            canvasId: 'TemperatureCanvas',
            type: 'line',
            categories: simulationData.categories,
            animation: true,
            legend:true,
            background: '#f5f5f5',
            series: [{
                name: '温度曲线图',
                data: simulationData.data,
                format: function (val, name) {
                    return val.toFixed(2) + '℃';
                }
            }, ],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                title: '温度 (℃)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: 320,
            height: 250,
            dataLabel: false,
            dataPointShape: true,
            
            extra: {
                lineStyle: 'curve'
            }
            
        })
    ///////////////////////////////////////////////////////////////
    
  },

 

  /////////////////////////////////////////////////////////////
  onShow:function(){
    // 页面显示
   
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
 
  ChangeTemperature: function (e) {
    wx.navigateTo({
      url: '../Change_Temperature/Change_Temperature?type=' + this.data.result.temperature + '&device_id=' + this.data.device_id + '&fly_status=' + this.data.result.fly_status
    })
  },

  ChangeHumidy: function (e) {
    wx.navigateTo({
      url: '../Change_Humidy/Change_Humidy?type=' + this.data.result.humidity + '&device_id=' + this.data.device_id
    })
  },

  ChangeLight: function (e) {
    wx.navigateTo({
      url: '../Change_Light/Change_Light?type=' + this.data.result.light_oumu + '&device_id=' + this.data.device_id + '&light_status=' + this.data.result.light_status
    })
  },

  ChangeVideo: function (e) {
    wx.navigateTo({
      url: '../Change_Video/Change_Video' + '?device_id=' + this.data.device_id
    })
  },

};
Page(pageConfig);

// 获取页面堆栈，表示历史访问过的页面，最后一个元素为当前页面
const page = getCurrentPages();


