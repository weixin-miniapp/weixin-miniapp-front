var app = getApp()
Page({

  data: {
    initialInput:'',
    lessonId:null,
    lessonName:null,
    list:[],
    comment:null,
    myComment:null,
    userName:null,
    userInfo:null,
  },
  getComment:function(e){
    this.setData ({
      myComment : e.detail.value
    })
    console.log(this.data.myComment)
  },
  submitComments:function(e){
    this.setData({
      initialInput:''
    })
    var that =this;
    wx.request({
      url: 'https://www.sunlikeme.xyz/lesson/comment',
      data: {
        content: that.data.myComment,
        lessonId: that.data.lessonId,
        unionId: app.globalData.userId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': app.globalData.userId
      },
      method: "POST",
      success: function (result) {
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
              lessonName:result.data.data.lessonName
            })
            for (var i = result.data.data.comments.length-1; i < result.data.data.comments.length; i++) {
              var list = that.data.list;
              list.push({
                comment: result.data.data.comments[i]["content"],
                userName: result.data.data.comments[i]["user"].nickName,
                userInfo: result.data.data.comments[i]["user"].portrait
              });
              that.setData({
                list: list,
              })
            }
            console.log(that.data.list)
          },
          fail: function () {
            console.log('获取课程失败，检查网络连接')
          }
        })
      },
      fail: function () {
        console.log('登陆失败，检查网络连接')
      }
    })  
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'lessonId',
      success: function(result) {
        that.setData({
          lessonId: result.data
        })
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
              lessonName: result.data.data.lessonName
            })
            for (var i = 0; i < result.data.data.comments.length; i++) {
              var list = that.data.list;
              list.push({
                comment: result.data.data.comments[i]["content"],
                userName: result.data.data.comments[i]["user"].nickName,
                userInfo: result.data.data.comments[i]["user"].portrait
              });
              that.setData({
                list: list,
              })
            }
          },
          fail: function () {
            console.log('获取课程失败，检查网络连接')
          }
        })
      },
      fail: function () {
        console.log('登陆失败，检查网络连接')
      }
    })
  }
})