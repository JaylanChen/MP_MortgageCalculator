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
    switch (mortgage.loanType) {
        case '1': //商业贷款
            totalLoan = mortgage.businessTotalLoan;
            // 等额本息
            if (mortgage.paymentMethod === 1) {
                for (let j = 0; j < paymentMonth; j++) {
                    //商业本息月还款额
                    let syInterest = equalPrincipalAndInterest(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
                    totalPaid += syInterest.monthlyPayment;
                    monthDetails.push(syInterest);
                }
            } else {
                //等额本金
                for (let j = 0; j < paymentMonth; j++) {
                    //商业本金月还款额
                    let tsyPrincial = equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
                    totalPaid += tsyPrincial.monthlyPayment;

                    monthDetails.push(tsyPrincial);
                }
            }
            break;
        case '2': //公积金贷款
            totalLoan = mortgage.gjjTotalLoan;
            // 等额本息
            if (mortgage.paymentMethod === 1) {
                for (let j = 0; j < paymentMonth; j++) {
                    //公积金本息月还款额
                    let gjjInterest = equalPrincipalAndInterest(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate, j);
                    totalPaid += gjjInterest.monthlyPayment;
                    monthDetails.push(gjjInterest);
                }
            } else {
                //等额本金
                for (let j = 0; j < paymentMonth; j++) {
                    //本金月还款额
                    let gjjPrincial = equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate, j);
                    totalPaid += tempPrincial.monthlyPayment;

                    monthDetails.push(gjjPrincial);
                }
            }
            break;
        case '3': //组合贷款
            totalLoan = mortgage.businessTotalLoan + mortgage.gjjTotalLoan;
            // 等额本息
            if (mortgage.paymentMethod === 1) {
                for (let j = 0; j < paymentMonth; j++) {
                    //商业本息月还款额
                    let syInterest = equalPrincipalAndInterest(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
                    //公积金本息月还款额
                    let gjjInterest = equalPrincipalAndInterest(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate, j);

                    let totalInterest = {
                        monthlyPayment: syInterest.monthlyPayment + gjjInterest.monthlyPayment,
                        principal: syInterest.principal + gjjInterest.principal,
                        interest: syInterest.interest + gjjInterest.interest,
                        balance: syInterest.balance + gjjInterest.balance
                    };
                    totalPaid += totalInterest.monthlyPayment;
                    monthDetails.push(totalInterest);
                }
            } else {
                //等额本金
                // let syPrincipal = equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate);
                // let gjjPrincipal = equalPrincipal(mortgage.gjjTotalLoan, paymentMonth, mortgage.gjjLoanRate);
                // monthlyPayment = syPrincipal.monthlyPayment + gjjPrincipal.monthlyPayment;
                // balance = gjjPrincipal.balance + syPrincipal.balance;
                // totalPaid = monthlyPayment;

                for (let j = 0; j < paymentMonth; j++) {
                    //商业本金月还款额
                    let syPrincipal = equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
                    totalPaid += syPrincipal.monthlyPayment;
                    //公积金本金月还款额
                    let gjjPrincipal = equalPrincipal(mortgage.businessTotalLoan, paymentMonth, mortgage.businessLoanRate, j);
                    totalPaid += gjjPrincipal.monthlyPayment;

                    let totalPrincial = {
                        monthlyPayment: syPrincipal.monthlyPayment + gjjPrincipal.monthlyPayment,
                        principal: syPrincipal.principal + gjjPrincipal.principal,
                        interest: syPrincipal.interest + gjjPrincipal.interest,
                        balance: syPrincipal.balance + gjjPrincipal.balance
                    };
                    monthDetails.push(totalPrincial);
                }
            }
            break;
    }

    monthlyPayment = monthDetails[0].monthlyPayment;
    balance = monthDetails[0].balance;

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