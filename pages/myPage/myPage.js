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
    sex: '',
    role: ''
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
      if(userInfo.role==0){
        that.setData({
        role:'老师'
        })
      }
      if (userInfo.role == 1) {
       
        that.setData({
          role: '学生'
        })
      }
      if (userInfo.gender == 1) {
        that.setData({
          sex: '男'
        })
      }
      if (userInfo.gender == 2) {
        that.setData({
          sex: '女'
        })
      }
    })
  }
})