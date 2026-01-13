
import type { ProductInput } from '../types';
import { AMAZON_CATEGORIES, AMAZON_MARKETPLACES } from '../constants';

export interface PricingResult {
    currencyFormatter: Intl.NumberFormat;
    baseProductCost: number;
    totalTaxes: number;
    referralFee: number;
    fulfillmentFee: number;
    otherFees: number;
    totalAmazonFees: number;
    totalCost: number;
    idealPrice: number;
    minPrice: number;
    netProfitPerUnit: number;
    netProfitMargin: number;
    estimatedMonthlyProfit: number;
    desiredProfitMargin: number;
    competitorPrice: number;
    // Formatted strings
    formattedBaseProductCost: string;
    formattedTotalTaxes: string;
    formattedReferralFee: string;
    formattedFulfillmentFee: string;
    formattedOtherFees: string;
    formattedTotalCost: string;
    formattedIdealPrice: string;
    formattedMinPrice: string;
    formattedNetProfit: string;
    formattedEstimatedMonthlyProfit: string;
    formattedCompetitorPrice: string;
}

// Simplified FBA fee calculator for the US marketplace. 
// A real-world app would need detailed tables for each country.
const calculateUSFbaFee = (weight: number, length: number, width: number, height: number): number => {
    // This is a simplified model. Real FBA fees are complex and tiered.
    const volume = (length * width * height) / 1728; // cubic feet
    const dimensionalWeight = (length * width * height) / 139;

    const greaterWeight = Math.max(weight, dimensionalWeight);

    if (greaterWeight <= 1) return 3.22;
    if (greaterWeight <= 2) return 4.90;
    if (greaterWeight <= 3) return 5.60;
    return 5.60 + (greaterWeight - 3) * 0.38; // Example for > 3 lbs
};

const calculateDBAFee = (weight: number): number => {
    // Simplified model for DBA (e.g., Delivery by Agent)
    // Fixed fee + per lb fee
    const fixedFee = 2.00;
    const perLbFee = 0.50;
    return fixedFee + (weight * perLbFee);
};


export function calculatePricing(input: ProductInput): PricingResult {
    // Sanitize inputs to avoid NaN issues
    const safeInput = {
        productCost: Number(input.productCost) || 0,
        internationalShippingCost: Number(input.internationalShippingCost) || 0,
        insurance: Number(input.insurance) || 0,
        packagingCost: Number(input.packagingCost) || 0,
        weight: Number(input.weight) || 0,
        length: Number(input.length) || 0,
        width: Number(input.width) || 0,
        height: Number(input.height) || 0,
        desiredProfitMargin: Number(input.desiredProfitMargin) || 0,
        estimatedMonthlySales: Number(input.estimatedMonthlySales) || 0,
        competitorPrice: Number(input.competitorPrice) || 0,
        importTaxRate: Number(input.importTaxRate) || 0,
        vatRate: Number(input.vatRate) || 0,
        customsFee: Number(input.customsFee) || 0,
    };

    const marketplace = AMAZON_MARKETPLACES[input.amazonMarketplace] || AMAZON_MARKETPLACES.US;
    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: marketplace.currency,
    });

    // 1. Calculate Base Product Cost
    const baseProductCost = safeInput.productCost + safeInput.internationalShippingCost + safeInput.insurance + safeInput.packagingCost;

    // 2. Calculate Taxes
    const importTax = input.includeTaxes ? baseProductCost * (safeInput.importTaxRate / 100) : 0;
    const vat = input.includeTaxes ? baseProductCost * (safeInput.vatRate / 100) : 0;
    const customsFee = input.includeTaxes ? safeInput.customsFee : 0;
    const totalTaxes = importTax + vat + customsFee;

    // 3. Landed Cost (Cost of product + taxes to get it ready for sale)
    const landedCost = baseProductCost + totalTaxes;

    // 4. Calculate Amazon Fees (some are fixed, some depend on price)
    let fulfillmentFee = 0;
    if (input.fulfillmentType === 'FBA') {
        // Placeholder for other marketplaces
        fulfillmentFee = calculateUSFbaFee(safeInput.weight, safeInput.length, safeInput.width, safeInput.height);
    } else if (input.fulfillmentType === 'DBA') {
        fulfillmentFee = calculateDBAFee(safeInput.weight);
    }
    // FBM fees are complex (shipping credits vs actual cost). We'll treat it as 0 for this calculator's fulfillment fee portion.
    
    // Other fixed fees (e.g., storage fees, fixed closing fees) can be added here.
    const otherFees = 0;
    const totalFixedCostsAndFees = landedCost + fulfillmentFee + otherFees;

    // Referral fee is a percentage of the selling price
    const referralFeePercentage = AMAZON_CATEGORIES[input.amazonCategory] || 0.15;
    const desiredProfitMarginPercentage = safeInput.desiredProfitMargin / 100;

    // 5. Calculate Ideal Selling Price using the formula: SP = (FixedCosts) / (1 - ReferralFee% - ProfitMargin%)
    const denominator = 1 - referralFeePercentage - desiredProfitMarginPercentage;
    const idealPrice = denominator > 0 ? totalFixedCostsAndFees / denominator : totalFixedCostsAndFees / (1-referralFeePercentage); // Avoid division by zero or negative

    // 6. Calculate Min Price (0% profit)
    const minPriceDenominator = 1 - referralFeePercentage;
    const minPrice = minPriceDenominator > 0 ? totalFixedCostsAndFees / minPriceDenominator : totalFixedCostsAndFees;

    // 7. Calculate final numbers based on Ideal Price
    const referralFee = idealPrice * referralFeePercentage;
    const totalAmazonFees = referralFee + fulfillmentFee + otherFees;
    const totalCost = landedCost + totalAmazonFees;
    const netProfitPerUnit = idealPrice - totalCost;
    const netProfitMargin = idealPrice > 0 ? (netProfitPerUnit / idealPrice) * 100 : 0;
    const estimatedMonthlyProfit = netProfitPerUnit * safeInput.estimatedMonthlySales;

    return {
        currencyFormatter,
        baseProductCost,
        totalTaxes,
        referralFee,
        fulfillmentFee,
        otherFees,
        totalAmazonFees,
        totalCost,
        idealPrice,
        minPrice,
        netProfitPerUnit,
        netProfitMargin,
        estimatedMonthlyProfit,
        desiredProfitMargin: safeInput.desiredProfitMargin,
        competitorPrice: safeInput.competitorPrice,
        // Formatted strings
        formattedBaseProductCost: currencyFormatter.format(baseProductCost),
        formattedTotalTaxes: currencyFormatter.format(totalTaxes),
        formattedReferralFee: currencyFormatter.format(referralFee),
        formattedFulfillmentFee: currencyFormatter.format(fulfillmentFee),
        formattedOtherFees: currencyFormatter.format(otherFees),
        formattedTotalCost: currencyFormatter.format(totalCost),
        formattedIdealPrice: currencyFormatter.format(idealPrice),
        formattedMinPrice: currencyFormatter.format(minPrice),
        formattedNetProfit: currencyFormatter.format(netProfitPerUnit),
        formattedEstimatedMonthlyProfit: currencyFormatter.format(estimatedMonthlyProfit),
        formattedCompetitorPrice: currencyFormatter.format(safeInput.competitorPrice),
    };
}
