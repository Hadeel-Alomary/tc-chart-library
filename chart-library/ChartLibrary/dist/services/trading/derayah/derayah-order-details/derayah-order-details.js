var DerayahOrderDetails = (function () {
    function DerayahOrderDetails() {
    }
    DerayahOrderDetails.mapResponseToOrderDetails = function (response, order) {
        var data = response.data;
        var responseResult = data.result;
        var responseActions = data.actions;
        var actions = [];
        for (var _i = 0, responseActions_1 = responseActions; _i < responseActions_1.length; _i++) {
            var action = responseActions_1[_i];
            actions.push({
                actionDate: action.actiondate,
                actionStatus: action.actionstatus,
                actionType: action.actiontype,
                dealQuantity: action.dealquantity,
                fees: action.fees,
                lastUpdate: action.lastupdated,
                netDealAmount: action.netdealamount,
                orderType: action.orderside,
                rejectionCode: action.rejectioncode,
                sequenceNumber: action.sequencenumber,
                validTill: +action.validtill,
                price: action.price,
                vat: action.vat
            });
        }
        return {
            actions: actions,
            averagePrice: responseResult.averagePrice,
            collectedFees: responseResult.feesCollected,
            date: responseResult.orderDate,
            dealAmount: responseResult.estimatedAmount,
            estimatedFees: responseResult.estimatedFee,
            exchangeCode: responseResult.exchangeCode,
            executedAmount: responseResult.executionAmount,
            executionType: responseResult.executionType,
            fillType: responseResult.fillType,
            filledQuantity: responseResult.filledQuantity,
            minQuantity: responseResult.minQuantity,
            netAmount: responseResult.netAmount,
            netAmountAccountCurrency: responseResult.netAmountInAcctCurrency,
            orderSide: responseResult.side,
            orderStatus: responseResult.orderstatus,
            portfolio: responseResult.portfolio,
            quantity: responseResult.quantity,
            remainedQuantity: responseResult.remainingQuantity,
            symbol: responseResult.symbol,
            userID: responseResult.userId,
            validTill: responseResult.validTill,
            validTillDate: responseResult.validTillDate,
            requestedPrice: responseResult.price,
            stopPrice: responseResult.stopPrice,
            discloseQuantity: responseResult.discloseQuantity,
            blockedAmount: responseResult.blockedAmount,
            cashAccountName: responseResult.cashAccountName,
            vat: responseResult.vatAmountEqu,
            vatId: responseResult.vatIdNo,
            executionVat: responseResult.execVAT,
            order: order
        };
    };
    return DerayahOrderDetails;
}());
export { DerayahOrderDetails };
//# sourceMappingURL=derayah-order-details.js.map