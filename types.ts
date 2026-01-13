
export interface ProductInput {
    productCost: number | '';
    purchaseCurrency: string;
    internationalShippingCost: number | '';
    insurance: number | '';
    packagingCost: number | '';
    weight: number | ''; // in lbs or kg
    length: number | '';
    width: number | '';
    height: number | '';
    fulfillmentType: 'FBA' | 'FBM' | 'DBA';
    amazonCategory: string;
    amazonMarketplace: string;
    desiredProfitMargin: number;
    estimatedMonthlySales: number | '';
    competitorPrice: number | '';
    importTaxRate: number | '';
    vatRate: number | '';
    customsFee: number | '';
    includeTaxes: boolean;
}
