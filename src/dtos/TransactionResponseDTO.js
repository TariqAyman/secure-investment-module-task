class TransactionResponseDTO {
    constructor({
        paymentId,
        hashedUserId,
        originalCurrency,
        initialInvestment,
        convertedUSD,
        projectedValueDate,
        projectedUSD,
        roiPercentage,
        status
    }) {
        this.paymentId = paymentId;
        this.hashedUserId = hashedUserId;
        this.originalCurrency = originalCurrency;
        this.initialInvestment = initialInvestment;
        this.convertedUSD = convertedUSD;
        this.projectedValueDate = projectedValueDate;
        this.projectedUSD = projectedUSD;
        this.roiPercentage = roiPercentage;
        this.status = status;
    }
}

module.exports = {
    TransactionResponseDTO
};
