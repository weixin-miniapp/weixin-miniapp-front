// pages/addquestion/addquestion.js
var app = getApp()
Page({
  data: {
    lessonId:null
  },
  onLoad: function (options) {
    console.log("接收到的lessonId=" + options.lessonId);
    this.setData({
      lessonId:options.lessonId
    })
  },


  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that=this;
    var value = e.detail.value;
    var choices = []
    var answerStr = ''
    choices = [{ "choiceNum": "1", "content": value.choicea },
    { "choiceNum": "2", "content": value.choiceb },
    { "choiceNum": "3", "content": value.choicec },
    { "choiceNum": "4", "content": value.choiced }]
    var compare = function (x, y) {//比较函数
      if (x < y) {
        return -1;
      } else if (x > y) {
        return 1;
      } else {
        return 0;
      }
    }
    value.correctAnswer.sort(compare)
    for (var i = 0; i < value.correctAnswer.length - 1; i++)
      answerStr += value.correctAnswer[i] + ","
    answerStr += value.correctAnswer[value.correctAnswer.length-1]
    console.log(answerStr)
    wx.request({
      url: 'https://www.sunlikeme.xyz/question/setQuestionForLesson',
      data: {
        'answerTime': value.answerTime,
        'choices':choices,
        'content': value.content,
        'correctAnswer':answerStr,
        'isSingle':value.radioSingle,
        'lesson':{"lessonId":that.data.lessonId}
      },
      header: {
        "Accept": "*/*",
        'unionId': app.globalData.userId
      },
      method: "POST",
      success: function (result) {
        console.log(result)
        wx.showModal({
          title: '已发送',
          content: result.data.msg,
        })
      },
      fail: function () {
        console.log('创建问题失败')
        wx.showToast({
          title: '创建问题失败',
        })
      }
    })

  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})