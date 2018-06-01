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
    teach:null,

    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // 正在直播
    liveList: [
      {
        coverImg: 'http://i0.hdslb.com/bfs/live/96025d17ed05961230a7d1401ca1fe3b79cc12db.jpg',
        avatarImg: 'http://i2.hdslb.com/bfs/face/c55b2eae13646925187514c6f19e19293294d0c5.jpg',
        name: '尤樱',
        desp: '你女朋友在直播你不来看看吗？',
        online: '877',
        avid: 'av5'
      },
      {
        coverImg: 'http://i0.hdslb.com/bfs/live/a1678768dd9c7023af7ab0f3de2a2df2c525e741.jpg',
        avatarImg: 'http://i0.hdslb.com/bfs/face/d1bec5ec111987537ecf3e7f43a8b3678ed3c5c3.jpg',
        name: '我是小麦伊哦哦',
        desp: '告别:我爱你们',
        online: '877',
        avid: 'av6'
      },
      {
        coverImg: 'http://i0.hdslb.com/bfs/live/89047f3faee35d0cb095d7dfb01ec4d3a8ec4434.jpg',
        avatarImg: 'http://i0.hdslb.com/bfs/face/1e31ac069058528e26b9be60b26d86c9c9a99f62.jpg',
        name: '坂本叔',
        desp: '【坂本】非洲黑客',
        online: '877',
        avid: 'av7'
      },
      {
        coverImg: 'http://i0.hdslb.com/bfs/live/24dbcc68325ff5fb3d235af97ad075dc5087733a.jpg',
        avatarImg: 'http://i2.hdslb.com/bfs/face/c55b2eae13646925187514c6f19e19293294d0c5.jpg',
        name: 'miriちゃん',
        desp: '日语点歌姬',
        online: '877',
        avid: 'av8'
      }
    ],


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
  onLoad: function () {
    this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
    }
})
