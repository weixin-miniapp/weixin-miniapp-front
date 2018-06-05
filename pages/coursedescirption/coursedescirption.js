// pages/coursedescirption/coursedescirption.js
var app=getApp()
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
    statusToString: '',
    teacherName: null,
    teacherInfo: null,
    study:[],
    comments:[],
    question:null
  },
  gotolive: function () {
    //开始直播按钮
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'lessonId',
      success: function (result) {
        that.setData({
          lessonId:result.data
        })
        console.log(that.data.lessonId)
        wx.request({
          url: 'https://www.sunlikeme.xyz/lesson/listLessonById',
          data: {
            'unionId': app.globalData.userId,
            'lessonId': that.data.lessonId
          },
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'unionId': app.globalData.userId
          },
          method: "GET",
          success: function (result) {
            that.setData({
              header: 'https://www.sunlikeme.xyz' + result.data.data.header,
              lessonId: result.data.data.lessonId,
              lessonName: result.data.data.lessonName,
              introduction: result.data.data.introduction,
              status: result.data.data.status,
              onlineTime: result.data.data.onlineTime,
              offlineTime: result.data.data.offlineTime,
              multiparts: result.data.data.multiparts
            })
          },
          fail: function () {
            console.log('获取课程失败，检查网络连接')
          }
        })
      }
    })
  },
  gotosetques: function () {
    wx.navigateTo({
      url: '../addquestion/addquestion',
    })
  }
})