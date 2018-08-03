const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`;
}
/**
 * 获取当前商业基准利率
 */
const getBusinessBaseRate = year => {
  if (year <= 1) {
    return 4.35;
  }
  else if (year <= 3) {
    return 4.75;
  }
  else if (year <= 5) {
    return 4.75;
  }
  else {
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
    loanRateArr.push({ value: rateValue, text: rateText });
  }
  return loanRateArr;
}

/**
 * 获取当前公积金基准利率
 */
const getGJJBaseRate = year => {
  if (year <= 5) {
    return 2.75;
  }
  else {
    return 3.25;
  }
}
const gjjRateDiscountArr = [1, 1.1, 1.2];
/**
 * 获取当前商业利率波动
 */
const getGJJLoanRateArr = year => {
  const baseRate = getGJJBaseRate(year);
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
    loanRateArr.push({ value: rateValue, text: rateText });
  }
  return loanRateArr;
}

module.exports = {
  formatDate: formatDate,
  getBusinessLoanRateArr: getBusinessLoanRateArr,
  getGJJLoanRateArr: getGJJLoanRateArr
}
