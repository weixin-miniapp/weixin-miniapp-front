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
    teach: [],
    statusToString: null,
    teacherName: null,
    teacherInfo: null,
    list: [],
    showButton: false
  },
  toIntroduction: function (e) {
    wx.setStorage({
      key: "lessonId",
      data: e.currentTarget.id
    })
    wx.navigateTo({
      url: '/pages/coursedescirption/coursedescirption'
    })
  },

  onLoad: function (e) {
    if (app.globalData.userInfo.role == 0) {
      this.setData({
        showButton: true
      })
    }
  },

  onShow: function () {

    var that = this;
    wx.request({
      url: 'https://www.sunlikeme.xyz/lesson/list',
      data: {
        'unionId': app.globalData.userId,
        'pageSize': 20,
        'showOnlyMine': 0,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': app.globalData.userId
      },
      method: "GET",
      success: function (result) {
        var list = [];
        var teach = [];
        for (var i = 0; i < result.data.data.length; i++) {

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
            statusToString: that.data.statusToString
          });
          that.setData({
            list: list,
          })
        }
        console.log(that.data.list);
      },
      fail: function () {
        console.log('获取课程失败，检查网络连接')
      }
    })
  }
})