// pages/livepull/livepull.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen:false,
    lessonId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.connectSocket({
      url: 'wss://www.sunlikeme.xyz/websocket'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      this.socketOpen = true
    })
    wx.onSocketMessage(function (res) {
      console.log('收到onmessage事件:', res)
    })
    var Stomp = require('../../utils/stomp.js').Stomp;
    Stomp.setInterval = function () { }
    Stomp.clearInterval = function () { }
    var client = Stomp.over(wx);
    client.connect({ userId: getApp().globalData.userId, lessonId: this.data.lessonId }, function (frame) {
      setConnected(true);
      console.log('Connected: ' + frame);
      client.subscribe('/user/question/getQuestion', function (result) {
        console.log(result);
      });
      client.subscribe('/user/question/getAnswer', function (result) {
        //显示答案
        console.log(result);
      });
      client.subscribe('/user/question/getCloseWindow', function (result) {
        //关闭弹窗
        console.log(result);
      });

    })
  },

  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindPlay() {
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})