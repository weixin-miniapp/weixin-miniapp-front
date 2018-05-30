
Page({
  data: {
    lessonId:''
    },
  onLoad: function () {
    wx.connectSocket({
      url: 'wss://www.sunlikeme.xyz/hts-websocket'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
    })
    wx.onSocketMessage(function (res) {
      console.log('收到onmessage事件:', res)
    })
    Stomp = require('../../utils/stomp.js').Stomp;
    Stomp.setInterval = function () { }
    Stomp.clearInterval = function () { }
    var client = Stomp.over(ws);
    client.connect({ userId: getApp().globalData.userId, lessonId: "???" }, function (frame) {
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
  //发送问题
  SendQuestions: function (questionId) {
    client.send('/app/question/sendQuestion', { lessonId: this.data.lessonId }, questionId);
  },
  //发送回答
  SendAnswer: function (questionId) {
    client.send('/app/question/sendAnswer', { lessonId: this.data.lessonId }, questionId);
  },
  //结束答题
  CloseQuestion: function () {
    client.send('/app/question/closeQuestion', { lessonId: this.data.lessonId  },'');
  },
  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher')
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  bindStart() {
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
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
  bindSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  }


})