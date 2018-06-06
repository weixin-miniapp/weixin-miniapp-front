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
    studentName:null,
    studentInfo:null,
    studentList:[],
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
              multiparts: result.data.data.multiparts,
              teacherName: result.data.data.teach[0]["nickName"]
            })
            for (var i=0;i<result.data.data.study.length;i++){
              var studentList = that.data.studentList;
              studentList.push({
                studentName:result.data.data.study[i]["nickName"],
                studentInfo:result.data.data.study[i]["portrait"]
              })
            }
            console.log(that.data.studentList)
            that.setData({
              studentList: studentList,
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