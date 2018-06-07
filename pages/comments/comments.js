var app = getApp()
Page({

  data: {
    lessonId:null,
    comments:[],
    myComment:null
  },
  getComment:function(e){
    this.data.myComment = e.detail.value
  },
  submitComments:function(e){
    wx.request({
      url: 'https://www.sunlikeme.xyz/lesson/comment',
      data: {
        content: this.data.myComment,
        encryptedData: userRes.encryptedData,
        iv: userRes.iv
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      //服务端的回掉  
      success: function (result) {
        var userId = result.data.data.id;
        wx.setStorageSync("userId", userId);
        getApp().globalData.userId = userId;
      },
      fail: function () {
        console.log('登陆失败，检查网络连接')
      }
    })  
  },
  onLoad: function (options) {
  
  }
})