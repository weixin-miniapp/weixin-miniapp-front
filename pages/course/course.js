// pages/course/course.js
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    lessonId: null,
    header: null,
    lessonName: null,
    introduction: null,
    status: null,
    onlineTime: null,
    offlineTime: null,
    multiparts: null,
    teach:[],
    statusToString: '',
    teacherName: null,
    teacherInfo: null,
    list:[]
  },

  toAddCourse:function(e){
    console.log('yeah');
    wx.navigateTo({
      url: '../addcourse/addcourse',
    })
  },
  onLoad: function (e) 
  {
    var that = this;
    wx.request({
      url: 'https://www.sunlikeme.xyz/lesson/list',
      data: {
        'unionId': app.globalData.userId,
        'pageSize': 20,
        'showOnlyMine': 1,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': app.globalData.userId
      },
      method: "GET",
      success: function (result) {
        for (var i = 0; i < result.data.data.length; i++) {
          var list = that.data.list;
          var teach = that.data.teach;
          list.push({
            header: 'https://www.sunlikeme.xyz' + result.data.data[i]["header"],
            lessonId: result.data.data[i]["lessonId"],
            lessonName: result.data.data[i]["lessonName"],
            introduction: result.data.data[i]["introduction"],
            status: result.data.data[i]["status"],
            onlineTime: result.data.data[i]["onlineTime"],
            offlineTime: result.data.data[i]["offlineTime"],
            multiparts: result.data.data[i]["multiparts"],
            teacherInfo: result.data.data[i]["teach"][0]["portrait"],
            teacherName: result.data.data[i]["teach"][0]["nickName"],
          });
          that.setData({
            list: list,
          })
          if (result.data.data[i]["status"] == 0) {
            that.setData({
              statusToString: '未开始'
            })
          }
          else if (result.data.data[i]["status"] == 1) {
            that.setData({
              statusToString: '直播中'
            })
          }
          else if (result.data.data[i]["status"] == 2) {
            that.setData({
              statusToString: '已结束'
            })
          }
        }
        console.log(that.data.list);
      },
      fail: function () {
        console.log('获取课程失败，检查网络连接')
      }
    })
  },

})