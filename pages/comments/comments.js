var app = getApp()
var GetList= function (that) {
  that.setData({
    hidden: false
  });
  wx.request({
    url: 'https://www.sunlikeme.xyz/lesson/getComment',
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
      var list = [];
      for (var i = 0; i < result.data.data.length; i++) {
        
        list.push({
          comment: result.data.data[i]["content"],
          userName: result.data.data[i]["user"].nickName,
          userInfo: result.data.data[i]["user"].portrait
        });
        that.setData({
          list: list,
        })
        console.log(that.data.list)
      }
      that.setData({
        hidden: true
      });
    },
    fail: function () {
      console.log('获取课程失败，检查网络连接')
    }
  })
}
Page({
  data: {
    initialInput: '',
    lessonId: null,
    lessonName: null,
    list: [],
    comment: null,
    myComment: null,
    userName: null,
    userInfo: null,
    hidden: true,
  },
  getComment: function (e) {
    this.setData({
      myComment: e.detail.value
    })
    console.log(this.data.myComment)
  },
  submitComments: function (e) {
    this.setData({
      initialInput: ''
    })
    var that = this;
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

        that.refresh();
      },
      fail: function () {
        console.log('登陆失败，检查网络连接')
      }
    })
  },
  onLoad: function (options) {
    var that = this;

        that.setData({
          lessonId: options.lessonId,
          lessonName: options.lessonName
        })
    
  },

  refresh: function (event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    GetList(this)
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据
    var that = this;
    GetList(that);
  },


})