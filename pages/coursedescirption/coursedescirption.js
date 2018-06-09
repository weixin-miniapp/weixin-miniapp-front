// pages/coursedescirption/coursedescirption.js
var app=getApp()
var utils = require('../../utils/util.js')
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
    question:null,
    distinction:'进入课程'
  },
  toComments:function(e){
    wx.navigateTo({
      url: '/pages/comments/comments'
    })
  },
  gotolive: function () {
    //开始直播按钮
    //0为老师
    if (getApp().globalData.userInfo.role ==0)
        this.startLive();
    else if (getApp().globalData.userInfo.role == 1)
      this.watchLive();
      else {
      wx.showToast({
        title: "直播未开始",
        icon: 'none',
        duration: 5000
      });
      }
  },
 watchLive: function(){
   var that = this;
    wx.request({
      url: 'https://www.sunlikeme.xyz/live/watchLive',
      data: {
        'lessonId': that.data.lessonId,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': getApp().globalData.userId
      },
      method: "POST",
      success: function (result) {
        if (result.data.code == 200) {
          //绑定直播url
          console.log('开始观看直播')
          wx.navigateTo({
            url: '../livepull/livepull?lessonId=' + that.data.lessonId + "&rmtp_url=" + encodeURIComponent(result.data.data),
          });

          
        }
        else {
        console.log(result.data.msg)
          wx.showToast({
          title: result.data.msg,
          icon: 'none',
          duration: 5000
        });
      }
      }
    });
  },


startLive: function () {
  var that = this;
    wx.request({
      url: 'https://www.sunlikeme.xyz/live/startLive',
      data: {
        'lessonId': this.data.lessonId,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': getApp().globalData.userId
      },
      method: "POST",
      success: function (result) {
        console.log(result);
        console.log('开始直播');
        if (result.data.code == 200) {
          //绑定直播url
          wx.navigateTo({
            url: '../livepush/livepush?lessonId=' + that.data.lessonId +"&rmtp_url="+encodeURIComponent(result.data.data),
          });
          
        }
        else {
          console.log(result.data.msg)
          wx.showToast({
            title: result.data.msg,
            icon: 'none',
            duration: 5000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 2000
        })
        console.log('登陆失败，检查网络连接')
      }
    });
  },

  onLoad: function (options) {
    if (app.globalData.role==0){
      setData({
        distinction:'开始直播'
      })
    }
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
            console.log(result.data.data.introduction)
            that.setData({
              header: 'https://www.sunlikeme.xyz' + result.data.data.header,
              lessonId: result.data.data.lessonId,
              lessonName: result.data.data.lessonName,
              introduction: result.data.data.introduction,
              status: result.data.data.status,
              onlineTime: utils.parseTime(result.data.data.onlineTime),
              offlineTime: utils.parseTime(result.data.data.offlineTime),
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
  setquestion: function () {
    wx.navigateTo({
      url: '../addquestion/addquestion?lessonId='+this.data.lessonId,
    })
  }
})