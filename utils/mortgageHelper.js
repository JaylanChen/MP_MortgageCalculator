/**
 *〔贷款本金×月利率×（1＋月利率）＾还款月数〕÷〔（1＋月利率）＾还款月数－1〕
 * 本金还款的月还款额(参数: 贷款总额 / 贷款总月份 / 月利率)
 */
const equalPrincipalAndInterest = (total, months, monthRate) => {
    let tempRate = Math.pow((1 + monthRate), months);
    let monthlyPayment = total * monthRate * tempRate / (tempRate - 1);
    return monthlyPayment;
}

/**
 * 每月月供额 = 每月应还本金 + 每月应还利息
 * 每月应还本金 = 贷款本金 ÷ 还款月数
 * 每月应还利息 = (贷款本金 - 已归还本金累计额) × 月利率
 * 本金还款的月还款额(参数: 贷款总额 / 贷款总月份 / 月利率)
 */
const equalPrincipal = (total, months, monthRate) => {
    let principal = total / months * 1.0;
    let interest = total * monthRate;
    let monthlyPayment = principal + interest;
    return monthlyPayment;
}

let tempTotalPaid = 0;

/**
 * 等额本息 月供明细
 * @param {*待还本金} surplus 
 * @param {*没有偿还本息} monthlyPayment 
 * @param {*月利率} monthRate 
 * @param {*还款月数} months 
 * @param {*开始还款日期} startDate 
 */
const getInterestDetails = (surplus, monthlyPayment, monthRate, months, startDate) => {
    tempTotalPaid = 0;
    let monthDetails = [];
    for (let j = 0; j < months; j++) {
        let interest = surplus * monthRate;
        let principal = monthlyPayment - interest;
        surplus -= principal;
        tempTotalPaid += monthlyPayment;

        monthDetails.push({
            monthlyPayment: monthlyPayment,
            principal: principal,
            interest: interest,
            surplus: surplus,
            paymentDate: startDate.addMonths(j)
        });
    }
    return monthDetails;
}

/**
 * 等额本金 月供明细
 * @param {*待还本金} surplus 
 * @param {*没有偿还本金} principal 
 * @param {*月利率} monthRate 
 * @param {*还款月数} months 
 * @param {*开始还款日期} startDate 
 */
const getPrincipalDetails = (surplus, principal, monthRate, months, startDate) => {
    tempTotalPaid = 0;
    let monthDetails = [];
    for (let j = 0; j < months; j++) {
        let interest = surplus * monthRate;
        let monthlyPayment = principal + interest;
        surplus -= principal;
        tempTotalPaid += monthlyPayment;

        monthDetails.push({
            monthlyPayment: monthlyPayment,
            principal: principal,
            interest: interest,
            surplus: surplus,
            paymentDate: startDate.addMonths(j)
        });
    }
    return monthDetails;
}


/**
 * 计算月供明细
 * @param {贷款信息} mortgage 
 */
const calculatePaymentDetail = (mortgage) => {
    let monthlyPayment = 0;
    let balance = 0;
    let paymentMonth = mortgage.paymentYear * 12;
    let totalLoan = 0;
    let totalPaid = 0;
    let monthDetails = [];

    mortgage.businessTotalLoan *= 10000;
    mortgage.gjjTotalLoan *= 10000;
    mortgage.businessLoanRate /= 100;
    mortgage.gjjLoanRate /= 100;

    let monthSYRate = mortgage.businessLoanRate / 12.0;
    let monthGJJRate = mortgage.gjjLoanRate / 12.0;

    switch (mortgage.loanType) {
        case '1': //商业贷款
            totalLoan = mortgage.businessTotalLoan;
            // 等额本息
            if (mortgage.paymentMethod === 1) {
                monthlyPayment = equalPrincipalAndInterest(mortgage.businessTotalLoan, paymentMonth, monthSYRate);
                monthDetails = getInterestDetails(mortgage.businessTotalLoan, monthlyPayment, monthSYRate, paymentMonth, mortgage.startDate);
                totalPaid = tempTotalPaid;
            } else {
                //等额本金
                let principal = mortgage.businessTotalLoan / paymentMonth * 1.0;
                monthlyPayment = equalPrincipal(mortgage.businessTotalLoan, paymentMonth, monthSYRate);
                monthDetails = getPrincipalDetails(mortgage.businessTotalLoan, principal, monthSYRate, paymentMonth, mortgage.startDate);
                totalPaid = tempTotalPaid;
                balance = monthDetails[0].principal * monthSYRate;
            }
            break;
        case '2': //公积金贷款
            totalLoan = mortgage.gjjTotalLoan;
            // 等额本息
            if (mortgage.paymentMethod === 1) {
                monthlyPayment = equalPrincipalAndInterest(mortgage.gjjTotalLoan, paymentMonth, monthGJJRate);
                monthDetails = getInterestDetails(mortgage.gjjTotalLoan, monthlyPayment, monthGJJRate, paymentMonth, mortgage.startDate);
                totalPaid = tempTotalPaid;
            } else {
                //等额本金
                let principal = mortgage.gjjTotalLoan / paymentMonth * 1.0;
                monthlyPayment = equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, monthGJJRate);
                monthDetails = getPrincipalDetails(mortgage.gjjTotalLoan, principal, monthGJJRate, paymentMonth, mortgage.startDate);
                totalPaid = tempTotalPaid;
                balance = monthDetails[0].principal * monthSYRate;
            }
            break;
        case '3': //组合贷款
            totalLoan = mortgage.businessTotalLoan + mortgage.gjjTotalLoan;
            // 等额本息
            if (mortgage.paymentMethod === 1) {
                //商业
                let syMonthlyPayment = equalPrincipalAndInterest(mortgage.businessTotalLoan, paymentMonth, monthSYRate);
                let syMonthDetails = getInterestDetails(mortgage.businessTotalLoan, syMonthlyPayment, monthSYRate, paymentMonth, mortgage.startDate);
                let syTotalPaid = tempTotalPaid;
                //公积金
                let gjjMonthlyPayment = equalPrincipalAndInterest(mortgage.gjjTotalLoan, paymentMonth, monthGJJRate);
                let gjjMonthDetails = getInterestDetails(mortgage.gjjTotalLoan, gjjMonthlyPayment, monthGJJRate, paymentMonth, mortgage.startDate);
                let gjjTotalPaid = tempTotalPaid;

                monthlyPayment = syMonthlyPayment + gjjMonthlyPayment;
                totalPaid = syTotalPaid + gjjTotalPaid;

                for (let j = 0; j < paymentMonth; j++) {
                    let syItem = syMonthDetails[j];
                    let gjjItem = gjjMonthDetails[j]
                    let totalInterest = {
                        monthlyPayment: syItem.monthlyPayment + gjjItem.monthlyPayment,
                        principal: syItem.principal + gjjItem.principal,
                        interest: syItem.interest + gjjItem.interest,
                        surplus: syItem.surplus + gjjItem.surplus,
                        paymentDate: syItem.paymentDate
                    };
                    //totalPaid += totalInterest.monthlyPayment;
                    monthDetails.push(totalInterest);
                }
            } else {
                //等额本金
                //商业
                let syPrincipal = mortgage.gjjTotalLoan / paymentMonth * 1.0;
                let syMonthlyPayment = equalPrincipal(mortgage.businessTotalLoan, paymentMonth, monthSYRate);
                let syMonthDetails = getPrincipalDetails(mortgage.businessTotalLoan, syPrincipal, monthSYRate, paymentMonth, mortgage.startDate);
                let syTotalPaid = tempTotalPaid;
                //公积金
                let gjjPrincipal = mortgage.gjjTotalLoan / paymentMonth * 1.0;
                let gjjMonthlyPayment = equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, monthGJJRate);
                let gjjMonthDetails = getPrincipalDetails(mortgage.gjjTotalLoan, gjjPrincipal, monthGJJRate, paymentMonth, mortgage.startDate);
                let gjjTotalPaid = tempTotalPaid;

                let syBalance = syMonthDetails[0].principal * monthSYRate;
                let gjjBalance = gjjMonthDetails[0].principal * monthSYRate;
                balance = syBalance + gjjBalance;
                monthlyPayment = syMonthlyPayment + gjjMonthlyPayment;
                totalPaid = syTotalPaid + gjjTotalPaid;

                for (let j = 0; j < paymentMonth; j++) {
                    let syItem = syMonthDetails[j];
                    let gjjItem = gjjMonthDetails[j]
                    let totalInterest = {
                        monthlyPayment: syItem.monthlyPayment + gjjItem.monthlyPayment,
                        principal: syItem.principal + gjjItem.principal,
                        interest: syItem.interest + gjjItem.interest,
                        surplus: syItem.surplus + gjjItem.surplus,
                        paymentDate: syItem.paymentDate
                    };
                    //totalPaid += totalInterest.monthlyPayment;
                    monthDetails.push(totalInterest);
                }
            }
            break;
    }

    totalLoan = totalLoan / 10000.0;
    totalPaid = totalPaid / 10000.0;
    return {
        monthlyPayment: monthlyPayment,
        balance: balance,
        totalLoan: totalLoan,
        totalPaid: totalPaid,
        totalInterest: totalPaid - totalLoan,
        monthDetails: monthDetails
    };

}

module.exports = {
    equalPrincipalAndInterest: equalPrincipalAndInterest,
    equalPrincipal: equalPrincipal,
    calculatePaymentDetail: calculatePaymentDetail
}