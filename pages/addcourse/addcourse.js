// pages/addcourse/addcourse.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
var app = getApp()
Page({
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,

    tempFilePaths: '',
    lessonName:null,
    teacherName:null,
    onlineTime:null,
    introduction:null
  },
  onLoad: function () {
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
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
  inputLessonName:function(e){
    this.setData({
      lessonName: e.detail.value
    })
  },
  inputTeacher:function(e){
    this.setData({
      teacherName: e.detail.value
    })
  },
  inputOnlineTime: function (e) {
    this.setData({
      onlineTime:e.detail.value
    })
  },
  inputIntroduction: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  addCourse:function(e){
    var that = this;
    console.log(this.data.tempFilePaths),
    console.log(app.globalData.userId),
    wx.uploadFile({
      url: 'https://www.sunlikeme.xyz/lesson/create',
      filePath: this.data.tempFilePaths[0],
      name: 'headerFile',
      formData: {
        'lessonName': this.data.lessonName,
        'introduction': this.data.introduction,
        'onlineTime': this.data.onlineTime,
        'unionId':app.globalData.userId
      },
      header: {
        "Content-Type":"multipart/form-data",
        'unionId': app.globalData.userId
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data)
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1200
        })
      },
      fail: function () {
        console.log('创建失败，检查网络连接')
      }
    })
  }
})  



