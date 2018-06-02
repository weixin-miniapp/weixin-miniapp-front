Page({

  data: {
    lessonId: '',
    rmtp_url: ''
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      lessonId: options.lessonId,
      rmtp_url: options.rmtp_url
    });
    // watchLive();
  },
  // watchLive: function(){
  //   wx.request({
  //     url: 'https://www.sunlikeme.xyz/live/watchLive',
  //     data: {
  //       'lessonId': this.data.lessonId,
  //     },
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded",
  //       'unionId': getApp().globalData.userId
  //     },
  //     method: "POST",
  //     success: function (result) {
  //       if (result.data.code == 200) {
  //         //绑定直播url
  //         var that = this;
  //         that.setData({
  //           rmtp_url: result.data.data
  //         });
  //         console.log('开始观看直播')
  //       }
  //       else {
  //       console.log(result.data.msg)
  //         wx.showToast({
  //         title: result.data.msg,
  //         icon: 'none',
  //         duration: 5000
  //       });
  //     }
  //     }
  //   });
  // },
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
    var socketOpen = false
    var socketMsgQueue = []
    function sendSocketMessage(msg) {
      console.log('send msg:')
      console.log(msg);
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }
    var ws = {
      send: sendSocketMessage,
      onopen: null,
      onmessage: null,
      close: function () {
        wx.closeSocket({
          code: 1000,
          reason: '用户退出',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
    wx.connectSocket({
      url: 'wss://www.sunlikeme.xyz/websocket'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
      for (var i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []

      ws.onopen && ws.onopen()
    })
    wx.onSocketMessage(function (res) {
      console.log('收到onmessage事件:', res)
      ws.onmessage && ws.onmessage(res)
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    var Stomp = require('../../utils/stomp.js').Stomp;
    Stomp.setInterval = function () { }
    Stomp.clearInterval = function () { }
    client = Stomp.over(ws);
    client.connect({ userId: getApp().globalData.userId, lessonId: this.data.lessonId }, function (frame) {
      console.log('Connected: ' + frame);
      //发送问题，学生的回掉
      client.subscribe('/user/question/getQuestion', function (result) {

        console.log(result);
      });
      client.subscribe('/user/question/getAnswer', function (result) {
        //显示答案，，学生的回掉
        console.log(result);
      });
      client.subscribe('/user/question/getCloseWindow', function (result) {
        //关闭弹窗，学生的回掉
        console.log(result);
      });

    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (client != null) {
      client.disconnect();
    }
    console.log('断开socket链接');
  },
  onUnload: function () {
    if (client != null) {
      client.disconnect();
    }
    console.log('断开socket链接');
  }
})