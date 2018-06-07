//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',

    userInfo: {},
    lessonId:null,
    header:null,
    lessonName:null,
    introduction:null,
    status:null,
    onlineTime:null,
    offlineTime:null,
    multiparts:null,
    teach:[],
    statusToString:'',
    teacherName:null,
    teacherInfo:null,
    list:[],

    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'http://i0.hdslb.com/bfs/archive/9bab17a99758cc7a72531d15d2d5a85d73b78ded.jpg',
      'http://i0.hdslb.com/bfs/archive/57d8001838ff81c64bef2682070e53efbe2736b7.jpg',
      'http://i0.hdslb.com/bfs/archive/499730dbcd76823664c48e661726a37164158795.jpg',
      'http://i0.hdslb.com/bfs/archive/c9682eac8f46fd2b261b739c5c88e21adaffab53.jpg',
      'http://i0.hdslb.com/bfs/archive/414cf391f88bb098ded766b1d7effd9216be34ef.jpg'
    ],
    // 是否显示面板指示点
    indicatorDots: false,
    // 是否自动切换
    autoplay: true,
    // 自动切换时间间隔
    interval: 5000,
    // 滑动动画时长
    duration: 1000
  }, 
  goToSearch:function(e){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toIntroduction:function(e){
    wx.setStorage({
      key: "lessonId",
      data: e.currentTarget.id
    })
    wx.navigateTo({
      url: '/pages/coursedescirption/coursedescirption'
    })
  },
  onLoad: function () {
    var that = this;
    //未设置role,弹框设置role
    if (app.globalData.userInfo.role == 2) {
      wx.showActionSheet({
        itemList: ['教师', '学生'],
        success: function (res) {
          console.log(res.tapIndex);
          wx.request({
            url: 'https://www.sunlikeme.xyz/user/selectRole',
            data: {
              'roleType': res.tapIndex,
            },
            header: {
              "content-type": "application/x-www-form-urlencoded",
              'unionId': getApp().globalData.userId
            },
            method: "POST",
            success: function (result) {
              console.log(result);
              if (result.data.code == 200) {
                app.globalData.userInfo.role = res.tapIndex;
                that.setData({
                  userInfo: app.globalData.userInfo,
                });
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
              }
              else wx.showModal({
                title: '错误',
                content: result.data.msg,
                success: function (res) {
                  if (res.confirm) {
                  } else if (res.cancel) {
                  }
                }
              })
            }
          });
        }
        });
      }
  
    wx.request({
      url: 'https://www.sunlikeme.xyz/lesson/list',
      data: {
        'unionId': app.globalData.userId,
        'pageSize': 4,
        'showOnlyMine': 0,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'unionId': app.globalData.userId
      },
      method: "GET",
      success: function (result) {
        for (var i = 0; i < result.data.data.length; i++) {
          var list = that.data.list;
          var statusToString;
          if (result.data.data[i]["status"] == 0) {
           
              statusToString='未开始';
            
          }
          else if (result.data.data[i]["status"] == 1) {
            
              statusToString= '直播中';
          }
          else if (result.data.data[i]["status"] == 2) {
            
              statusToString='已结束';
            
          }
          list.push({
            header: 'https://www.sunlikeme.xyz' + result.data.data[i]["header"],
            lessonId: result.data.data[i]["lessonId"],
            lessonName: result.data.data[i]["lessonName"],
            introduction: result.data.data[i]["introduction"],
            status: result.data.data[i]["status"],
            onlineTime: result.data.data[i]["onlineTime"],
            offlineTime: result.data.data[i]["offlineTime"],
            multiparts: result.data.data[i]["multiparts"],
            teacherInfo: result.data.data[i]["teach"][0]["portrait"],
            teacherName: result.data.data[i]["teach"][0]["nickName"],
            statusToString: statusToString
          });
          that.setData({
            list: list,
          })
        
        }
        console.log(that.data.list);
      },
      fail: function () {
        console.log('获取课程失败，检查网络连接')
      }
    }),
    this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
    }  
})
