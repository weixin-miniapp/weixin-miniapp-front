var client;
const app = getApp();
Page({
  data: {
     //lessonId:'',
     //rmtp_url: 'rtmp://23921.liveplay.myqcloud.com/live/23921_dfc19e64cf8448f98a1e66ccb9627078',
    //lessonId: '7e56beb7be8741178f3cde786f4f0421',
    //rmtp_url: 'rtmp://23921.livepush.myqcloud.com/live/23921_2437192d66?bizid=23921&txSecret=6b6ff27fb1f563e7bc0bf71c570481c9&txTime=5B0D78FF',
    rmtp_url: "",
    showModalStatus: false,
    detail: '',
    currentOpt: [false, false, false, false],
    questionId: null
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      lessonId: options.lessonId,
      rmtp_url: decodeURIComponent(options.rmtp_url)
    });
    console.log(this.data.rmtp_url);
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
  //点击选项事件；更改颜色，保存选项
  tapOption: function (e) {
    console.log(e);
    var id = parseInt(e.currentTarget.id) - 1;
    var option = 'currentOpt[' + id + ']'
    this.setData({ [option]: this.data.currentOpt[id] == true ? false : true })
    console.log(this.data.currentOpt)
  },
  //提交答案点击事件
  tapAnswer: function (e) {
    var that = this;
    var answer = '';
    for (var i = 1; i <= 4; i++)
      if (that.data.currentOpt[i - 1])
        answer = answer + i + ','
    if (answer.length > 1)
      answer = answer.substring(0, answer.length - 1);
    console.log(answer)
    wx.request({
      url: 'https://www.sunlikeme.xyz/question/answerQuestion',
      data: {
        'answer': answer,
        'unionId': app.globalData.userId,
        'questionId': that.data.questionId,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': app.globalData.userId
      },
      method: "POST",
      success: function (result) {
        console.log(result)
        wx.showModal({
          title: '已提交',
          content: result.data.msg,
        })
      },
      fail: function () {
        console.log('提交答案失败')
        wx.showToast({
          title: '提交答案失败',
        })
      }
    })
  },
  //关闭问题弹窗
  tapClose: function (e) {
    this.setData(
      {
        showModalStatus: false,
        currentOpt: [false, false, false, false]
      }
    )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
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

      //获取问题，学生的回掉
      client.subscribe('/user/question/getQuestion', function (result) {
        console.log(result.body);
        var res = JSON.parse(result.body);
        var detail;

        detail = {
          "content": res.content,
          "choicea": res.choices[0]["content"],
          "choiceb": res.choices[1]["content"],
          "choicec": res.choices[2]["content"],
          "choiced": res.choices[3]["content"],
        };
        console.log(detail);
        setTimeout(function () {
          that.setData({
            showModalStatus: false,
            detail: '',
            questionId: ''
          })
        }.bind(this), res.answerTime * 1000);
        that.setData({
          showModalStatus: true,
          detail: detail,
          questionId: res.questionId
        });
      });

      client.subscribe('/user/question/getAnswer', function (result) {
        //显示答案，，学生的回掉
        console.log(result);
        var res = JSON.parse(result.body);
        console.log(res);
        var answer = '';
        for (var i = 1; i <= 4; i++)
          if (that.data.currentOpt[i - 1])
            answer = answer + i + ','
        if (answer.length > 1)
          answer = answer.substring(0, answer.length - 1);
        console.log(answer)
      if (answer == res)
        wx.showToast({
          title: '回答正确！',
          duration: 2000
        })
      else
        wx.showModal({
          title: '回答错误！',
          content: '正确答案：'+res,
        })
      });

      client.subscribe('/user/question/getCloseWindow', function (result) {
        //关闭弹窗，学生的回掉
        console.log(result);
        that.setData({
          showModalStatus: false,
          currentOpt: [false, false, false, false]
        })
      })
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