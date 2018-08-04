// pages/detail/detail.js
const util = require('../../utils/util.js')
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
    let monthlyPayment = 0;
    let balance = 0;
    let paymentMonth = mortgage.paymentYear * 12;
    let totalLoan = 0;
    let totalPaid = 0;
    let loanTypeName = '等额本息(每月等额还款)';
    if(mortgage.paymentMethod === 2){
      loanTypeName = '等额本金(每月递减还款)';
    }
    switch (mortgage.loanType) {
      case '1':
        totalLoan = mortgage.businessTotalLoan;
        // 等额本息
        if (mortgage.paymentMethod === 1) {
          let interest1 = util.equalPrincipalAndInterest(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate);
          monthlyPayment = interest1.monthlyPayment;
          totalPaid = monthlyPayment * paymentMonth;
        } else {
          let principal1 = util.equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate);
          monthlyPayment = principal1.monthlyPayment;
          balance = principal1.balance;
          totalPaid = monthlyPayment;
          for (let j = 1; j < paymentMonth; j++) {
            //调用函数计算: 本金月还款额
            let tempPrincial = util.equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
            totalPaid += tempPrincial.monthlyPayment;
          }
        }
        break;
      case '2':
        totalLoan = mortgage.gjjTotalLoan;
        // 等额本息
        if (mortgage.paymentMethod === 1) {
          let interest2 = util.equalPrincipalAndInterest(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate);
          monthlyPayment = interest2.monthlyPayment;
          totalPaid = monthlyPayment * paymentMonth;
        } else {
          let principal2 = util.equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate);
          monthlyPayment = principal2.monthlyPayment;
          balance = principal2.balance;
          totalPaid = monthlyPayment;
          for (let j = 1; j < paymentMonth; j++) {
            //调用函数计算: 本金月还款额
            let tempPrincial = util.equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate, j);
            totalPaid += tempPrincial.monthlyPayment;
          }
        }
        break;
      case '3':
        totalLoan = mortgage.businessTotalLoan + mortgage.gjjTotalLoan;
        // 等额本息
        if (mortgage.paymentMethod === 1) {
          let syInterest = util.equalPrincipalAndInterest(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate);
          let gjjInterest = util.equalPrincipalAndInterest(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate);
          monthlyPayment = gjjInterest.monthlyPayment + syInterest.monthlyPayment;
          totalPaid = monthlyPayment * paymentMonth;
        } else {
          let syPrincipal = util.equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate);
          let gjjPrincipal = util.equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate);
          monthlyPayment = syPrincipal.monthlyPayment + gjjPrincipal.monthlyPayment;
          balance = gjjPrincipal.balance + syPrincipal.balance;
          
          totalPaid = monthlyPayment;
          for (let j = 1; j <= paymentMonth; j++) {
            //调用函数计算: 本金月还款额
            let tempPrincial = util.equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
            totalPaid += tempPrincial.monthlyPayment;
          }
          for (let k = 1; k <= paymentMonth; k++) {
            //调用函数计算: 本金月还款额
            let tempPrincial = util.equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, k);
            totalPaid += tempPrincial.monthlyPayment;
          }
        }
        break;
    }
    monthlyPayment = util.retainDecimal(monthlyPayment);
    let balanceStr = '';
    if (balance > 0) {
      balance = util.retainDecimal(balance);
      balanceStr = balance.toLocaleString();
    }
    let paymentMonthStr = monthlyPayment.toLocaleString();
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
    totalPaid = totalPaid / 10000.0;
    //totalPaid = totalPaid.toFixed(2);
    totalPaid = util.retainDecimal(totalPaid);
    let totalInterest = totalPaid - totalLoan;
    this.setData({
      monthlyPaymentStr: paymentMonthStr,
      monthlyPaymentClass: monthlyPaymentClass,
      balanceStr: balanceStr,
      totalLoanStr: totalLoan.toLocaleString(),
      totalInterestStr: totalInterest.toLocaleString(),
      TotalPaidStr: totalPaid.toLocaleString(),
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
      title: '感谢您的分享，谢谢你。',
      icon: 'none',
      duration: 1500
    })
  }
})