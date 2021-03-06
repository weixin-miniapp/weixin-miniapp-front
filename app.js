//坑6、js问题
// js执行顺序，在开发者工具中执行先执行aap.js然后执行其他js文件，但在手机上app.js和其他js是同时执行的，就比如说你在app.js里面向本地存储一个变量，然后再去index.js里面取这个变量，在开发者工具中是可以取到的，但在手机上它会取不到的。

//app.js
App({
  toLogin: function () {
    // 前往授权登录界面
    wx.navigateTo({
      url: '/pages/login/login',
    })

  },
  ready: function () {
    return Promise((resolve, reject) => {
      const userkey = wx.getStorageSync('userkey')
      const userId = wx.getStorageSync('userId')
      const sessionData = wx.getStorageSync('sessionData')
      // 检查用户是否具有登陆态
      if (!userkey || !userId || !sessionData) {
        // 如果未登录就前往登录界面
        this.toLogin()

      } else {

        resolve()

      }
    })
  },
  getUserInfo: function (cb) {

    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
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
                  if(userRes)
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
                      var userId =result.data.data.id;         
                      wx.setStorageSync("userId", userId);
                      getApp().globalData.userId = userId;
                    },
                      fail: function () {
                      console.log('登陆失败，检查网络连接')
                    }
                  })  
                  this.globalData.userInfo = userRes.userInfo;
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      }
    })

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      // wx.login({
      //   success: function () {
      //     wx.getUserInfo({
      //       success: function (res) {
      //         that.globalData.userInfo = res.userInfo
      //         typeof cb == "function" && cb(that.globalData.userInfo)
      //       }
      //     })
      //   }
      // })
    }
  },
  globalData: {
    userInfo: null,
    //每次请求带上该userId
    userId: null

  }
})