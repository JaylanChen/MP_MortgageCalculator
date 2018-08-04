const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`;
}

const retainDecimal = (num, decimal = 2) => {
  var numStr = (num * 1.0).toFixed(decimal + 1);
  return parseFloat(numStr.substr(0, numStr.length - 1));
}

/**
 * 获取当前商业基准利率
 */
const getBusinessBaseRate = year => {
  if (year <= 1) {
    return 4.35;
  } else if (year <= 3) {
    return 4.75;
  } else if (year <= 5) {
    return 4.75;
  } else {
    return 4.90;
  }
}
const businessRateDiscountArr = [0.7, 0.8, 0.83, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.30, 1.35, 1.4];
/**
 * 获取当前商业利率波动
 */
const getBusinessLoanRateArr = year => {
  const baseRate = getBusinessBaseRate(year);
  let loanRateArr = [];
  for (var discount of businessRateDiscountArr) {
    let rateValue = (baseRate * discount).toLocaleString();
    let rateText = '';
    if (discount < 1) {
      rateText = `${discount}折(${rateValue}%)`
    } else if (discount > 1) {
      rateText = `${discount}倍(${rateValue}%)`
    } else {
      rateText = `基准利率(${rateValue}%)`
    }
    loanRateArr.push({
      value: parseFloat(rateValue),
      text: rateText
    });
  }
  return loanRateArr;
}

/**
 * 获取当前公积金基准利率
 */
const getGJJBaseRate = year => {
  if (year <= 5) {
    return 2.75;
  } else {
    return 3.25;
  }
}
const gjjRateDiscountArr = [1, 1.1, 1.2];
/**
 * 获取当前商业利率波动
 */
const getGJJLoanRateArr = year => {
  const baseRate = getGJJBaseRate(year).toLocaleString();
  let loanRateArr = [];
  for (var discount of gjjRateDiscountArr) {
    var rateValue = baseRate * discount;
    let rateText = '';
    if (discount > 1) {
      rateText = `${discount}倍(${rateValue}%)`
    } else if (discount === 1) {
      rateText = `基准利率(${rateValue}%)`
    } else {
      rateText = `${discount}折(${rateValue}%)`
    }
    loanRateArr.push({
      value: parseFloat(rateValue),
      text: rateText
    });
  }
  return loanRateArr;
}

/**
 *〔贷款本金×月利率×（1＋月利率）＾还款月数〕÷〔（1＋月利率）＾还款月数－1〕
 * 本金还款的月还款额(参数: 贷款总额 / 贷款总月份 / 年利率)
 */
const equalPrincipalAndInterest = (total, months, loanRate) => {
  total = total * 10000;
  let monthRate = loanRate / 100.0 / 12.0;
  var tempRate = Math.pow((1 + monthRate), months);
  var monthlyPayment = total * monthRate * tempRate / (tempRate - 1);
  return {
    monthlyPayment: monthlyPayment,
    principal: 0,
    interest: 0,
    balance: 0
  }
}

/**
 * 每月月供额 = 每月应还本金 + 每月应还利息
 * 每月应还本金 = 贷款本金 ÷ 还款月数
 * 每月应还利息 = (贷款本金 - 已归还本金累计额) × 月利率
 * 本金还款的月还款额(参数: 贷款总额 / 贷款总月份 / 年利率 / 贷款当前月0～length-1)
 */
const equalPrincipal = (total, months, loanRate, currentMonth = 0) => {
  total = total * 10000;
  let monthRate = loanRate / 100.0 / 12.0;
  var principal = total / months * 1.0;
  var interest = (total - principal * currentMonth) * monthRate;
  var monthlyPayment = principal + interest;
  var balance = principal * monthRate;
  return {
    monthlyPayment: monthlyPayment,
    principal: principal,
    interest: interest,
    balance: balance
  }
}


module.exports = {
  formatDate: formatDate,
  retainDecimal: retainDecimal,
  getBusinessLoanRateArr: getBusinessLoanRateArr,
  getGJJLoanRateArr: getGJJLoanRateArr,
  equalPrincipalAndInterest: equalPrincipalAndInterest,
  equalPrincipal: equalPrincipal
}