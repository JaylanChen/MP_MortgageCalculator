// pages/detail/detail.js
const util = require('../../utils/util.js')
const mortgageHelper = require('../../utils/mortgageHelper.js')
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthlyPaymentStr: '0',
    monthlyPaymentClass: '',
    balanceStr: '',
    totalLoanStr: '',
    totalInterestStr: '',
    TotalPaidStr: '',
    loanTypeName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mortgage = app.globalData.mortgageData;
    let loanTypeName = '等额本息(每月等额还款)';
    if(mortgage.paymentMethod === 2){
      loanTypeName = '等额本金(每月递减还款)';
    }
    var mortgageDetail = mortgageHelper.calculatePaymentDetail(mortgage);

    mortgageDetail.monthlyPayment = util.retainDecimal(mortgageDetail.monthlyPayment);
    let balanceStr = '';
    if (mortgageDetail.balance > 0) {
      mortgageDetail.balance = util.retainDecimal(mortgageDetail.balance);
      balanceStr = mortgageDetail.balance.toLocaleString();
    }
    let paymentMonthStr = mortgageDetail.monthlyPayment.toLocaleString();
    let monthlyPaymentClass = '';
    if (paymentMonthStr.length < 8) {
      monthlyPaymentClass = '';
    } else if (paymentMonthStr.length < 10) {
      monthlyPaymentClass = 'bigNum1';
    }else if (paymentMonthStr.length <14) {
      monthlyPaymentClass = 'bigNum2';
    } else{
      monthlyPaymentClass = 'bigNum3';
    }
    //mortgageDetail.totalPaid = mortgageDetail.totalPaid.toFixed(2);
    mortgageDetail.totalPaid = util.retainDecimal(mortgageDetail.totalPaid);
    mortgageDetail.totalInterest = util.retainDecimal(mortgageDetail.totalInterest);
    this.setData({
      monthlyPaymentStr: paymentMonthStr,
      monthlyPaymentClass: monthlyPaymentClass,
      balanceStr: balanceStr,
      totalLoanStr: mortgageDetail.totalLoan.toLocaleString(),
      totalInterestStr: mortgageDetail.totalInterest.toLocaleString(),
      TotalPaidStr: mortgageDetail.totalPaid.toLocaleString(),
      loanTypeName: loanTypeName
    });
  },
  backToIndex: function (){
    wx.navigateTo({
      url: '../index/index'
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