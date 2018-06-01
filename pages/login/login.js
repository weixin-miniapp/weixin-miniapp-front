// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onTapLogin: function () {
       
    wx.login({
      success: wxres => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: userRes => {
                  // 可以将 res 发送给后台解码出 unionId
                  if (userRes)
                    wx.request({
                      url: 'https://www.sunlikeme.xyz/user/login',
                      data: {
                        code: wxres.code,
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
                        app.globalData.userId = userId;
                        app.globalData.userInfo = userRes.userInfo;
                        wx.switchTab({
                          url: '../index/index'
                        });  
                      },
                      fail: function () {
                        console.log('登陆失败，检查网络连接')
                      }
                    })



                 

                }
              })
            }
            else {
              console.log("用户拒绝了权限请求，donothing")

            }
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onTapLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})