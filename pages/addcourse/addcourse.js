// pages/addcourse/addcourse.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
var app = getApp()
Page({
  data: {
    year:null,
    month:null,
    date:null,
    hour:null,
    minute:null,
    second:null,
    time:null,
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    timechanged:false,
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
  changeDateTime(e) {
    this.setData({ 
      dateTime: e.detail.value,
      year: '20'+this.data.dateTime[0],
      month: this.data.dateTime[1] + 1,
      date: this.data.dateTime[2] + 1,
      hour: this.data.dateTime[3] + 1,
      minute: this.data.dateTime[4] + 1,
      second: this.data.dateTime[5] +1
    });
    if (this.data.dateTime[1] + 1 < 10) {
      this.setData({
        month: '0' + (this.data.dateTime[1]+1)
      })
    }
    if (this.data.dateTime[2] + 1 < 10) {
      this.setData({
        date: '0' + (this.data.dateTime[2] + 1)
      })
    }
    if (this.data.dateTime[3] + 1 < 10) {
      this.setData({
        hour : '0' + (this.data.dateTime[3])
      })
    }
    if (this.data.dateTime[4] + 1 < 10) {
      this.setData({
        minute: '0' + (this.data.dateTime[4])
      })
    }
    if (this.data.dateTime[5] + 1 < 10) {
      this.setData({
        second: '0' + (this.data.dateTime[5])
      })
    }
    this.setData({
      time: this.data.year + '-' + this.data.month + '-' + this.data.date + ' ' + this.data.hour + ':' + this.data.minute + ':' + this.data.second
    })
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
    console.log(e.detail.value)
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      timechanged:true
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
  inputIntroduction: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  addCourse:function(e){
    if (this.data.timechanged==true){
      var that = this;
      if (that.data.tempFilePaths == '') {
        wx.showToast({
          title: '请设置封面图片',
          icon: 'none',
          duration: 1200
        })
        return;
      }
      wx.uploadFile({
        url: 'https://www.sunlikeme.xyz/lesson/create',
        filePath: this.data.tempFilePaths[0],
        name: 'headerFile',
        formData: {
          'lessonName': this.data.lessonName,
          'introduction': this.data.introduction,
          'onlineTime': this.data.time,
          'unionId': app.globalData.userId
        },
        header: {
          "Content-Type": "multipart/form-data",
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
    else{
      wx.showToast({
        title: '请选择提交时间',
        icon:'loading',
        duration: 1200
      })
    }
  }
})  



