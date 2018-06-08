var client;
const app = getApp();
Page({
  data: {
    lessonId: '',
    correctAnswer: '',
    showModalStatus: false,
    showLoading:false,
    progress:null,
    list: [],
    questionId: '',
    rmtp_url: '',
    tempFilePaths: ''
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      rmtp_url: decodeURIComponent(options.rmtp_url),
      lessonId: options.lessonId,
    })
    console.log(this.data.rmtp_url);
  },

  //问题列表点击事件
  tapQuest: function (e) {
    console.log(e)
    this.setData({
      questionId: e.currentTarget.id
    })
  },



  //调出发送提问弹窗
  prepareQuestions: function () {
    var that = this
    if (that.data.list.length == 0) {
      wx.request({
        url: 'https://www.sunlikeme.xyz/question/getQuestionForLesson',
        data: {
          'unionId': app.globalData.userId,
          'lessonId': that.data.lessonId,
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          'unionId': app.globalData.userId
        },
        method: "GET",
        success: function (result) {
          var list = that.data.list
          console.log(result)

          for (var i = 0; i < result.data.data.length; i++) {
            list.push({
              checked: false,
              content: result.data.data[i]["content"],
              questionId: result.data.data[i]["questionId"],
              answerTime: result.data.data[i]["answerTime"],
              correctAnwser: result.data.data[i]["correctAnswer"],
              isSingle: result.data.data[i]["isSingle"]
            });
          }
          console.log(list)
          that.setData({
            list: list
          })


        },
        fail: function () {
          console.log('获取问题失败')
        }
      })
    }

    this.setData({
      showModalStatus: true
    })
  },


  //发送问题
  sendQuestions: function () {
    client.send('/app/question/sendQuestion', { lessonId: this.data.lessonId, questionId: this.data.questionId, userId: getApp().globalData.userId }, );
  },
  //发送回答
  sendAnswer: function () {
    client.send('/app/question/sendAnswer', { lessonId: this.data.lessonId, questionId: this.data.questionId, userId: getApp().globalData.userId }, );

  },
  //结束答题
  closeQuestion: function () {
    client.send('/app/question/closeQuestion', { lessonId: this.data.lessonId, userId: getApp().globalData.userId }, '');
    this.setData({ showModalStatus: false })
  },
  //获取答题情况
  getFeedback: function (e) {
    var that=this;
    wx.request({
      url: 'https://www.sunlikeme.xyz/question/getTotalAnswer',
      data: {
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
        var data=result.data.data
        wx.showModal({
          title: '学生答题统计',
          content: '未答题：'+data.nodone+' 答对：'+data.right+' 答错：'+data.wrong
        })
        }
    })
  },
  //停止直播
  stopLive: function () {
    wx.request({
      url: 'https://www.sunlikeme.xyz/live/stopLive',
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
        if (result.data.code == 200) {
          console.log('结束直播')
        }
        else
          wx.showToast({
            title: result.data.msg,
            icon: 'none',
            duration: 2000
          });
      },
      fail: function () {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 2000
        })
        console.log('登陆失败，检查网络连接')
      }
    })
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
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    var that = this
    // this.startLive();
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
      //发送问题，教师的回掉
      client.subscribe('/user/question/getQuestion', function (result) {
        console.log(result);
        wx.showToast({
          title: result.body,
          duration: 1000
        })
      });
      client.subscribe('/user/question/getAnswer', function (result) {
        //显示答案，，教师的回掉
        console.log(result);
        wx.showToast({
          title: result.body,
          duration: 1000
        })
      });
      client.subscribe('/user/question/getCloseWindow', function (result) {
        //关闭弹窗，教师的回掉
        console.log(result);
        wx.showToast({
          title: result.body,
          duration: 1000
        })
      });

    })
  },

  //选择本地图片
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })

  },

  //上传图片到服务器
  bindUploadPhoto() {
    var that = this
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: 'https://www.sunlikeme.xyz/lesson/uploadMedia',
      filePath: this.data.tempFilePaths[0],
      name: 'multiparts',
      formData: {
        'lessonId': this.data.lessonId,
      },
      header: {
        "Content-Type": "multipart/form-data",
        'unionId': app.globalData.userId
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data)
        wx.hideLoading()
        wx.showToast({
          title: '上传图片成功',
          icon: 'success',
          duration: 1200
        })
        that.sendMultipart(data.data)
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '上传失败',
          content: '检查网络连接',
        })
      }
    })


  },

  //socket发送图片
  sendMultipart: function (url) {
    console.log(JSON.stringify(url))
    client.send('/app/question/sendMultipart', { lessonId: this.data.lessonId, userId: getApp().globalData.userId }, JSON.stringify(url));
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.stopLive();
    if (client != null) {
      client.disconnect();
    }
    console.log('断开socket链接');
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
    this.stopLive();
    if (client != null) {
      client.disconnect();
    }
    console.log("test onUnload");
  },
})