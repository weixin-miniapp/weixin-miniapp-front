// pages/usercenter/usercenter.js

var app = getApp()

Page({
  data: {
    userInfo: {
      nickname: '',
      sex: 0,
      identity:0,
      cover_thumb: 'http://img.zhichiwangluo.com/zc_app_default_photo.png'
    },
    genderArr: ['男', '女'],
    identityArr:['学生','老师'],
    isFromBack: false,
    phone: '',
    stuID:''
  },
  onLoad: function () {
    var userInfo = app.getUserInfo(),
      phone = userInfo.phone,
      stuID = userInfo.stuID,
      data = {
        'userInfo.nickname': userInfo.nickname,
        'userInfo.sex': userInfo.sex,
        'userInfo.identity':userInfo.identity,
        'userInfo.cover_thumb': userInfo.cover_thumb,
        'userInfo.stuID': userInfo.stuID,
        'userInfo.phone': userInfo.phone
      };
  },
  choosePhoto: function () {
    var that = this;
    app.chooseImage(function (imgUrl) {
      that.setData({
        'userInfo.cover_thumb': imgUrl
      })
    });
  },
  changeGender: function (e) {
    this.setData({
      'userInfo.sex': e.detail.value
    })
  },
  changeIdentity: function (e) {
    this.setData({
      'userInfo.identity':e.detail.value
    })
  },
  inputNickname: function (e) {
    this.setData({
      'userInfo.nickname': e.detail.value
    })
  },
  saveUserInfo: function () {
    var data = this.data.userInfo;

    app.sendRequest({
      url: '/index.php?r=AppData/saveUserInfo',
      method: 'post',
      data: data,
      success: function (res) {
        if (res.status === 0) {
          app.setUserInfoStorage(data);
          app.turnBack();
        }
      }
    });
  },

})




