// pages/search/search.js
const app = getApp()

Page({

  data: {
    list:[],
    lessonId: '',
    header:'',
    lessonName:'',
    introduction: '',
    status: '',
    onlineTime: '',
    offlineTime: '',
    multiparts: '',
    teach:[]
  },
  searchLesson: function (e) {
    var that = this;
    this.setData({
      lessonName: e.detail.value
    })
    wx.request({
      url: 'https://www.sunlikeme.xyz/lesson/list',
      data: {
        'unionId': app.globalData.userId,
        'pageSize': 20,
        'showOnlyMine': 0,
        'keyword': this.data.lessonName
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': app.globalData.userId
      },
      method: "GET",
      success: function (result) {
        for (var i = 0; i < result.data.data.length; i++) {
          var list = that.data.list;
          var teach = that.data.teach;
          list.push({
            header: 'https://www.sunlikeme.xyz'+ result.data.data[i]["header"],
            lessonId: result.data.data[i]["lessonId"],
            lessonName: result.data.data[i]["lessonName"],
            introduction: result.data.data[i]["introduction"],
            status: result.data.data[i]["status"],
            onlineTime: result.data.data[i]["onlineTime"],
            offlineTime: result.data.data[i]["offlineTime"],
            multiparts: result.data.data[i]["multiparts"],
            teach: result.data.data[i]["teach"]});
            /*for (var j = 0; j < teach.length; j++) {
              console.log(teach[j]);
            }*/
          //console.log(this.data.teach);
          that.setData({
            list: list
          })
        }
        console.log(that.data.list);
      },
      fail: function () {
        console.log('登陆失败，检查网络连接')
      }
    })
  },
  onLoad: function (options) {
    
  }
})