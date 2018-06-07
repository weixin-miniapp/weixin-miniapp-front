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
    statusToString:'',
  },
  toIntroduction: function (e) {
    wx.setStorage({
      key: "lessonId",
      data: e.currentTarget.dataset.id
    });
    wx.navigateTo({
      url: '/pages/coursedescirption/coursedescirption'
    })
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
        var list = [];
        for (var i = 0; i < result.data.data.length; i++) {
          var status;
          if (result.data.data[i]["status"] == 0) {
            status= '未开始' 
          }
          else if (result.data.data[i]["status"] == 1) {
            status= '直播中' 
          }
          else if (result.data.data[i]["status"] == 2) {
            status= '已结束' 
          }
          list.push({
            header: 'https://www.sunlikeme.xyz'+ result.data.data[i]["header"],
            lessonId: result.data.data[i]["lessonId"],
            lessonName: result.data.data[i]["lessonName"],
            introduction: result.data.data[i]["introduction"],
            status: result.data.data[i]["status"],
            onlineTime: result.data.data[i]["onlineTime"],
            offlineTime: result.data.data[i]["offlineTime"],
            multiparts: result.data.data[i]["multiparts"],
            teacherName: result.data.data[i]["teach"][0]["nickName"],
            statusToString: status
            });
           
          /*for (var j = 0; j < result.data.data[i]["teach"].length; j++) {
            teach.push({
              teacherName:result.data.data[i]["teach"][j]["nickName"]
            })
          }*/
        
        }
        that.setData({
          list: list,
        })
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