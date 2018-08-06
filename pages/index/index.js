//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面数据
   */
  data: {
    businessTotalLoan: 0,
    gjjTotalLoan: 0,
    loanType: '1',
    startDate: undefined,

    businessTotalLoanStr: '',
    gjjTotalLoanStr: '',
    showGJJ: false,
    showBusiness: true,
    gjjFocus: false,
    businessFocus: true,
    startDateStr: '',

    paymentMethodIndex: 0,
    paymentYearIndex: 29,
    businessLoanRateIndex: 9,
    gjjLoanRateIndex: 0,
    loanTypeArr: [{
      text: '商业贷款',
      id: 1,
      checked: true
    }, {
      text: '公积金贷款',
      id: 2
    }, {
      text: '组合贷款',
      id: 3
    }],
    paymentMethodArr: [{
      text: '等额本息(每月等额还款)',
      id: 1
    }, {
      text: '等额本金(每月递减还款)',
      id: 2
    }],
    paymentYearArr: [],
    businessLoanRateArr: [],
    gjjLoanRateArr: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var currentDate = new Date();
    var paymentYearArr = [];
    for (let i = 1; i <= 30; i++) {
      paymentYearArr.push({
        value: i,
        text: `${i}年 (${i * 12}月)`
      });
    }
    var tempArr = util.getBusinessLoanRateArr(this.data.paymentYear);
    this.setData({
      paymentYearArr: paymentYearArr,
      businessLoanRateArr: tempArr,
      gjjLoanRateArr: util.getGJJLoanRateArr(this.data.paymentYear),
      startDate: currentDate,
      startDateStr: util.formatDate(currentDate),
      businessLoanRate: tempArr[this.data.businessLoanRateIndex].value
    })
  },
  // 公共方法
  resetData: function (loanType) {
    let paymentYear = 30;
    var currentDate = new Date();
    this.setData({
      loanType: loanType,
      paymentMethodIndex: 0,
      paymentYearIndex: 29,
      businessLoanRateIndex: 9,
      gjjLoanRateIndex: 0,
      showBusiness: loanType === '1' || loanType === '3',
      showGJJ: loanType === '2' || loanType === '3',
      businessLoanRateArr: util.getBusinessLoanRateArr(paymentYear),
      gjjLoanRateArr: util.getGJJLoanRateArr(paymentYear),
      startDate: currentDate,
      startDateStr: util.formatDate(currentDate),
      businessFocus: loanType === '1' || loanType === '3',
      gjjFocus: loanType === '2',

    })
  },
  getMortgageData: function () {
    var data = {
      businessTotalLoan: parseFloat(this.data.businessTotalLoan),
      businessLoanRate: this.data.businessLoanRateArr[this.data.businessLoanRateIndex].value,
      gjjTotalLoan: parseFloat(this.data.gjjTotalLoan),
      gjjLoanRate: this.data.gjjLoanRateArr[this.data.gjjLoanRateIndex].value,
      paymentMethod: this.data.paymentMethodArr[this.data.paymentMethodIndex].id,
      paymentYear: this.data.paymentYearArr[this.data.paymentYearIndex].value,
      startDate: this.data.startDate,
      loanType: this.data.loanType
    }
    return data;
  },
  //事件处理函数
  businessTotalLoanInput: function (e) {
    let value = e.detail.value || 0;
    if(value === 0){
      this.setData({
        businessTotalLoan: 0,
        businessTotalLoanStr: ''
      })
      return;
    }
    let valueStr = value.toString();
    if(valueStr.indexOf(".") < valueStr.length -2){
      value = util.retainDecimal(value);
      this.setData({
        businessTotalLoan: value,
        businessTotalLoanStr: value
      })
    }
  },
  gjjTotalLoanInput: function (e) {
    let value = e.detail.value || 0.0;
    if(value === 0){
      this.setData({
        gjjTotalLoan: 0,
        gjjTotalLoanStr: ''
      })
      return;
    }
    let valueStr = value.toString();
    if(valueStr.indexOf(".") < valueStr.length -2){
      value = util.retainDecimal(value);
      this.setData({
        gjjTotalLoan: value,
        gjjTotalLoanStr: value
      })
    }
  },
  loanTypeChange: function (e) {
    var loanType = e.detail.value;
    this.resetData(loanType);
  },
  paymentMethodchange: function (e) {
    var index = e.detail.value;
    this.setData({
      paymentMethodIndex: index
    })
  },
  paymentYearchange: function (e) {
    var index = e.detail.value;
    var paymentYear = this.data.paymentYearArr[index].value;
    this.setData({
      paymentYearIndex: index,
      businessLoanRateArr: util.getBusinessLoanRateArr(paymentYear),
      gjjLoanRateArr: util.getBusinessLoanRateArr(paymentYear)
    })
  },
  startDateChange: function (e) {
    this.setData({
      startDate: new Date(e.detail.value),
      startDateStr: util.formatDate(new Date(e.detail.value))
    });
  },
  businessLoanRateChange: function (e) {
    var index = e.detail.value;
    this.setData({
      businessLoanRateIndex: index
    })
  },
  gjjLoanRateChange: function (e) {
    var index = e.detail.value;
    this.setData({
      gjjLoanRateIndex: index
    })
  },
  calculateLoan: function () {
    var mortgageData = this.getMortgageData();
    switch (mortgageData.loanType) {
      case "1":
        if (!mortgageData.businessTotalLoan) {
          wx.showToast({
            title: '请输入商业贷款金额',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            businessFocus: true
          })
          return;
        }
        break;
      case "2":
        if (!mortgageData.gjjTotalLoan) {
          wx.showToast({
            title: '请输入公积金贷款金额',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            gjjFocus: true
          })
          return;
        }
        break;
      case "3":
        if (!mortgageData.businessTotalLoan) {
          wx.showToast({
            title: '请输入商业贷款金额',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            businessFocus: true
          })
          return;
        }
        if (!mortgageData.gjjTotalLoan) {
          wx.showToast({
            title: '请输入公积金贷款金额',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            gjjFocus: true
          })
          return;
        }
        break;
    }
    app.globalData.mortgageData = mortgageData;
    wx.navigateTo({
      url: '../detail/detail'
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showToast({
      title: '感谢您的分享，谢谢您。',
      icon: 'none',
      duration: 1500
    })
  }
})