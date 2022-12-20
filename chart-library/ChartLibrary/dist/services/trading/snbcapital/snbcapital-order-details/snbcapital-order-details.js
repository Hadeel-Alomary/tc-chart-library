import { SnbcapitalOrderStatus } from '../snbcapital-order/snbcapital-order-status';
import { SnbcapitalOrderExpiration } from '../snbcapital-order/snbcapital-order-expiration';
var SnbcapitalOrderDetails = (function () {
    function SnbcapitalOrderDetails() {
    }
    SnbcapitalOrderDetails.mapResponseToOrderDetails = function (response, order, portfolio) {
        var responseResult = response.order;
        var responseExecution = response.execList;
        var executionList = [];
        for (var _i = 0, responseExecution_1 = responseExecution; _i < responseExecution_1.length; _i++) {
            var exec = responseExecution_1[_i];
            executionList.push({
                key: exec.keyope,
                executionQuantity: exec.execQty,
                price: exec.prc,
                commission: exec.feesCACurr,
                tax: exec.VATamt,
                execValue: exec.totAmt,
                status: SnbcapitalOrderStatus.getOrderStatus(exec.status),
                execDate: this.getOrderDetailDate(exec.execDate),
                reason: exec.causaleDesc ? exec.causaleDesc.plain : null,
            });
        }
        return {
            executions: executionList,
            order: order,
            portfolioName: portfolio.portfolioName,
            portfolioId: portfolio.portfolioId,
            date: order.date ? moment(order.date).format('YYYY-MM-DD') : '-',
            time: order.time ? order.time : '-',
            executionCondition: SnbcapitalOrderExpiration.getExpirationType(responseResult.timeParam, responseResult.qtyParam),
            expiryDate: this.getOrderDetailDate(responseResult.expiryDate),
            price: responseResult.limPrice,
            quantity: responseResult.orderQty,
            minimumQuantity: responseResult.minimumQty,
            announcedQuantity: responseResult.disclosedQty,
            commission: responseResult.estimatedComm.commItem.total,
            tax: responseResult.VATamt,
            orderValue: responseResult.amount,
            remainedQuantity: responseResult.remainingQty,
            executedQuantity: responseResult.execQty,
            avgPrice: responseResult.avgPrcExec,
            executionValue: responseResult.execAmt,
            combinedCommission: responseResult.VATamtCharged,
            executedTax: responseResult.chargedComm.commItem.total,
            totalAmountExec: responseResult.totAmtExec,
        };
    };
    SnbcapitalOrderDetails.getOrderDetailDate = function (date) {
        if (date == null) {
            return null;
        }
        if (date.isnull) {
            return null;
        }
        return date.year + "-" + date.month + "-" + date.day + "  " + date.hour + ":" + date.minute + ":" + date.second;
    };
    return SnbcapitalOrderDetails;
}());
export { SnbcapitalOrderDetails };
//# sourceMappingURL=snbcapital-order-details.js.map