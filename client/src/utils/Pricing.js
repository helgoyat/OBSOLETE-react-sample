export const convert = (price, priceCurrency, userCurrency) => {
    if (priceCurrency === userCurrency) {
        return price;
    } else {
        const convertedPrice = price * 1.65;
        return convertedPrice;
    };
};

export const convertAndFormat = (price, priceCurrency, userCurrency) => {
    if (priceCurrency === userCurrency) {
        return `${price.toFixed(2)} ${userCurrency}`;
    } else {
        const convertedPrice = price * 1.65;
        return `${convertedPrice.toFixed(2)} ${userCurrency}`;
    };
};

export const calculateCartOrderPricing = (subtotal, fee, reward, storeCurrency, buyerCurrency) => {
    const total = convert(parseFloat(subtotal), storeCurrency, buyerCurrency) + fee + reward;
    const pricing = {
        originalSubtotal: (buyerCurrency !== storeCurrency) ? convertAndFormat(parseFloat(subtotal), storeCurrency, storeCurrency) : null,
        subtotal: convertAndFormat(parseFloat(subtotal), storeCurrency, buyerCurrency),
        fee: convertAndFormat(fee, buyerCurrency, buyerCurrency),
        reward: convertAndFormat(reward, buyerCurrency, buyerCurrency),
        total: convertAndFormat(total, buyerCurrency, buyerCurrency)
    };
    return pricing;
};

export const calculateOrderItemPricing = (subtotal, fee, reward, storeCurrency, buyerCurrency, appCurrency) => {
    const pricing = {
        originalSubtotal: (appCurrency !== storeCurrency) ? convertAndFormat(parseFloat(subtotal), storeCurrency, storeCurrency) : null,
        subtotal: convertAndFormat(parseFloat(subtotal), storeCurrency, appCurrency),
        originalReward: (appCurrency !== buyerCurrency) ? convertAndFormat(reward, buyerCurrency, buyerCurrency) : null,
        reward: convertAndFormat(reward, buyerCurrency, appCurrency)
    };
    return pricing;
};

export const calculateOrderDepositPricing = (fee, reward, buyerCurrency) => {
    const total = fee + reward;
    const pricing = {
        fee: convertAndFormat(fee, buyerCurrency, buyerCurrency),
        reward: convertAndFormat(reward, buyerCurrency, buyerCurrency),
        total: convertAndFormat(total, buyerCurrency, buyerCurrency)
    };
    return pricing;
};