//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('totalLoan') || []

    wx.setStorageSync('businessLoanRate', logs)
  }
})