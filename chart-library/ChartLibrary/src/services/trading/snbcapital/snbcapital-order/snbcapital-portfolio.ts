

export interface SnbcapitalPortfolio {
    gBSCustomerCode: string,
    emailAddress: string,
    portfolioId: string,
    portfolioName: string,
    securityAccountBranchCode: string,
    securitySubAccountCode: string,
    cashAccountCode: string,
    cashAccountBranchCode: string,
    currency: SnbcapitalCurrencyInfo,
    securityAccountStatus: number
}

export interface SnbcapitalCurrencyInfo {
    CurrencyCode: string,
    CurrencyDescription: string
}
