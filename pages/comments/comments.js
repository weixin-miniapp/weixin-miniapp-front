var app = getApp()
Page({

  data: {
    lessonId:null,
    comments:[],
    myComment:null
  },
  getComment:function(e){
    this.data.myComment = e.detail.value
    console.log(this.data.myComment)
  },
  submitComments:function(e){
    
  },
  onLoad: function (options) {
  
  }
})