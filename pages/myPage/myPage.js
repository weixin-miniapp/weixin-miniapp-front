//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    user: {
      nickname: '',
      sex: 0,
      identity: 0,
      cover_thumb: 'http://img.zhichiwangluo.com/zc_app_default_photo.png'
    },
    genderArr: ['男', '女'],
    identityArr: ['学生', '老师'],
    isFromBack: false,
    phone: '',
    stuID: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: ''
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})