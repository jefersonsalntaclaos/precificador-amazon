
import React, { useState, useEffect, useMemo } from 'react';
import ProductForm from './components/ProductForm';
import ResultsDisplay from './components/ResultsDisplay';
import { calculatePricing, PricingResult } from './services/pricingCalculator';
import type { ProductInput } from './types';
import { AMAZON_CATEGORIES, AMAZON_MARKETPLACES } from './constants';
import { BarChart2, DollarSign, Package, TrendingUp } from 'lucide-react';

const initialProductInput: ProductInput = {
    productCost: 10,
    purchaseCurrency: 'USD',
    internationalShippingCost: 2,
    insurance: 0.5,
    packagingCost: 0.25,
    weight: 1, // in lbs or kg depending on marketplace
    length: 8,
    width: 6,
    height: 4,
    fulfillmentType: 'FBA',
    amazonCategory: 'Electronics',
    amazonMarketplace: 'US',
    desiredProfitMargin: 25,
    estimatedMonthlySales: 100,
    competitorPrice: 49.99,
    importTaxRate: 15,
    vatRate: 20,
    customsFee: 5,
    includeTaxes: true,
};


export default function App() {
    const [productInput, setProductInput] = useState<ProductInput>(initialProductInput);
    const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);

    useEffect(() => {
        const result = calculatePricing(productInput);
        setPricingResult(result);
    }, [productInput]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
          const { checked } = e.target as HTMLInputElement;
          setProductInput(prev => ({ ...prev, [name]: checked }));
        } else {
          setProductInput(prev => ({
              ...prev,
              [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
          }));
        }
    };
    
    const summaryCards = useMemo(() => {
        if (!pricingResult) return [];
        return [
            { title: 'Preço de Venda Ideal', value: pricingResult.formattedIdealPrice, icon: DollarSign, color: 'text-green-500', profitState: pricingResult.netProfitPerUnit > 0 ? 'positive' : 'negative' },
            { title: 'Lucro Líquido por Unidade', value: pricingResult.formattedNetProfit, icon: TrendingUp, color: pricingResult.netProfitPerUnit > 0 ? 'text-green-500' : 'text-red-500', profitState: pricingResult.netProfitPerUnit > 0 ? 'positive' : 'negative' },
            { title: 'Custo Total por Unidade', value: pricingResult.formattedTotalCost, icon: Package, color: 'text-yellow-500' },
            { title: 'Lucro Mensal Estimado', value: pricingResult.formattedEstimatedMonthlyProfit, icon: BarChart2, color: 'text-blue-500' },
        ];
    }, [pricingResult]);


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-sans">
            <header className="bg-white dark:bg-gray-900 shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">LucroCerto Amazon Calculator</h1>
                </div>
            </header>

            <main className="container mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <ProductForm 
                            productInput={productInput}
                            onInputChange={handleInputChange}
                            onSliderChange={(value) => setProductInput(prev => ({...prev, desiredProfitMargin: value}))}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        {pricingResult && <ResultsDisplay result={pricingResult} summaryCards={summaryCards} />}
                    </div>
                </div>
            </main>
             <footer className="text-center p-4 mt-8 text-gray-500 dark:text-gray-400 text-sm">
                <p>Desenvolvido como uma ferramenta premium para vendedores da Amazon.</p>
                <p>&copy; {new Date().getFullYear()} LucroCerto. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
