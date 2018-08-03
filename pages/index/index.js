//index.js
const util = require('../../utils/util.js')
//获取应用实例
//const app = getApp()

Page({
  /**
   * 页面数据
   */
  data: {
    businessTotalLoan: '',
    gjjTotalLoan: '',
    loanType: '1',
    paymentMethod: 1,
    paymentYear: 30,
    startDate: undefined,
    businessLoanRate: 0,
    gjjLoanRate: 0,

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
        id: i,
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
  //事件处理函数
  businessTotalLoanInput: function (e) {
    this.setData({
      businessTotalLoan: e.detail.value
    })
  },
  gjjTotalLoanInput: function (e) {
    this.setData({
      gjjTotalLoan: e.detail.value
    })
  },
  loanTypeChange: function (e) {
    var loanType = e.detail.value;
    var tempArr = util.getBusinessLoanRateArr(this.data.paymentYear);
    this.resetData(loanType);
  },
  paymentMethodchange: function (e) {
    var index = e.detail.value;
    var currentId = this.data.paymentMethodArr[index].id;
    this.setData({
      paymentMethod: currentId,
      paymentMethodIndex: index
    })
  },
  paymentYearchange: function (e) {
    var index = e.detail.value;
    var currentId = this.data.paymentYearArr[index].id;
    this.setData({
      paymentYear: currentId,
      paymentYearIndex: index
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
    var currentRate = this.data.businessLoanRateArr[index].value;
    this.setData({
      businessLoanRate: parseFloat(currentRate),
      businessLoanRateIndex: index
    })
  },
  resetData: function (loanType) {
    var tempArr = util.getBusinessLoanRateArr(30);
    var tempGJJArr = util.getBusinessLoanRateArr(30);
    var currentDate = new Date();
    this.setData({
      loanType: loanType,
      paymentYear: 30,
      paymentMethodIndex: 0,
      paymentYearIndex: 29,
      businessLoanRateIndex: 9,
      gjjLoanRateIndex: 0,
      showBusiness: loanType == '1' || loanType == '3',
      showGJJ: loanType == '2' || loanType == '3',
      businessLoanRate: tempArr[9].value,
      gjjLoanRate: tempGJJArr[0].value,
      startDate: currentDate,
      startDateStr: util.formatDate(currentDate)
    })
  },
  getData: function(){

    console.log(this.data.businessTotalLoan)
    console.log(this.data.businessLoanRate)
    console.log(this.data.gjjTotalLoan)
    console.log(this.data.gjjLoanRate)
    console.log(this.data.paymentMethod)
    console.log(this.data.paymentYear)
    console.log(this.data.startDate)
    var data = {
      businessTotalLoan: this.data.businessTotalLoan,
      businessLoanRate: this.data.businessLoanRateArr[this.data.businessLoanRateIndex],
      gjjTotalLoan: this.data.gjjTotalLoan,
      gjjLoanRate: this.data.gjjLoanRateArr[this.data.gjjLoanRateIndex]
    }
    return data;
  },
  calculateLoan: function () {
    switch (this.data.loanType) {
      case "1":
        if (this.data.businessTotalLoan.length < 1) {
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
        console.log(this.data.businessTotalLoan)
        console.log(this.data.businessLoanRate)
        console.log(this.data.paymentMethod)
        console.log(this.data.paymentYear)
        console.log(this.data.startDate)
        break;
      case "2":
        if (this.data.gjjTotalLoan.length < 1) {
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
        console.log(this.data.gjjTotalLoan)
        console.log(this.data.gjjLoanRate)
        console.log(this.data.paymentMethod)
        console.log(this.data.paymentYear)
        console.log(this.data.startDate)
        break;
      case "3":
        if (this.data.businessTotalLoan.length < 1) {
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
        if (this.data.gjjTotalLoan.length < 1) {
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
        console.log(this.data.businessTotalLoan)
        console.log(this.data.businessLoanRate)
        console.log(this.data.gjjTotalLoan)
        console.log(this.data.gjjLoanRate)
        console.log(this.data.paymentMethod)
        console.log(this.data.paymentYear)
        console.log(this.data.startDate)
        break;
    }

  }
})