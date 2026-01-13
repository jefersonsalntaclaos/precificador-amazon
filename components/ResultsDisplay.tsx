
import React from 'react';
import type { PricingResult } from '../services/pricingCalculator';
import Card from './Card';
import ProfitChart from './ProfitChart';
import { AlertTriangle, TrendingUp, TrendingDown, Info, CheckCircle } from 'lucide-react';

interface ResultsDisplayProps {
    result: PricingResult;
    summaryCards: { title: string; value: string; icon: React.ElementType; color: string; profitState?: string }[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, summaryCards }) => {
    const isProfitable = result.netProfitPerUnit > 0;
    const priceDifference = result.idealPrice - result.competitorPrice;
    const priceDifferencePercent = (priceDifference / result.competitorPrice) * 100;

    const competitorAnalysis = () => {
        if (priceDifference > 0) {
            return {
                message: `Seu preço ideal é ${priceDifferencePercent.toFixed(1)}% mais alto que a concorrência.`,
                suggestion: `Considere se seu produto oferece valor adicional para justificar o preço.`,
                icon: <TrendingUp className="text-yellow-500 mr-2" />,
            };
        } else {
            return {
                message: `Seu preço ideal é ${Math.abs(priceDifferencePercent).toFixed(1)}% mais baixo que a concorrência.`,
                suggestion: `Você tem uma vantagem competitiva no preço. Verifique se sua margem está saudável.`,
                icon: <TrendingDown className="text-green-500 mr-2" />,
            };
        }
    };
    
    const analysis = competitorAnalysis();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, index) => (
                    <Card key={index} className={`relative overflow-hidden ${card.profitState === 'negative' ? 'bg-red-50 dark:bg-red-900/20 border border-red-500' : ''}`}>
                         <div className={`absolute top-0 left-0 h-full w-1.5 ${isProfitable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex items-center">
                            <card.icon className={`w-8 h-8 mr-4 ${card.color}`} />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {!isProfitable && (
                <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    <div>
                        <p className="font-bold">Alerta de Margem Negativa!</p>
                        <p>Com a configuração atual, você está perdendo dinheiro em cada venda. Revise seus custos ou aumente o preço de venda.</p>
                    </div>
                </div>
            )}
            
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                 <div className="lg:col-span-3">
                    <Card title="Detalhamento dos Custos e Lucro">
                        <ul className="space-y-3 text-sm">
                            <ListItem label="Custo Base do Produto" value={result.formattedBaseProductCost} />
                            <ListItem label="Total de Impostos e Taxas" value={result.formattedTotalTaxes} isNegative />
                            <ListItem label="Taxa de Venda Amazon" value={result.formattedReferralFee} isNegative />
                            <ListItem label="Taxas de Logística (FBA/FBM/DBA)" value={result.formattedFulfillmentFee} isNegative />
                            <ListItem label="Outras Taxas Amazon" value={result.formattedOtherFees} isNegative />
                            <hr className="my-2 border-gray-200 dark:border-gray-700"/>
                            <ListItem label="Custo Total por Unidade" value={result.formattedTotalCost} isBold />
                            <ListItem label="Preço de Venda Ideal" value={result.formattedIdealPrice} isBold />
                            <hr className="my-2 border-gray-200 dark:border-gray-700"/>
                            <ListItem label="Lucro Líquido por Unidade" value={result.formattedNetProfit} isBold isProfit={isProfitable} />
                            <ListItem label="Margem de Lucro Líquida" value={`${result.netProfitMargin.toFixed(2)}%`} isBold isProfit={isProfitable} />
                        </ul>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                    <Card title="Distribuição de Preço">
                        <ProfitChart result={result} />
                    </Card>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Análise Competitiva" icon={<TrendingUp />}>
                     <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {analysis.icon}
                        <div>
                            <p className="font-semibold">{analysis.message}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.suggestion}</p>
                        </div>
                    </div>
                </Card>
                 <Card title="Sugestões de Preços" icon={<CheckCircle />}>
                    <div className="space-y-2">
                        <p className="flex justify-between"><span>Preço Mínimo (Lucro 0%):</span> <strong className="text-yellow-500">{result.formattedMinPrice}</strong></p>
                        <p className="flex justify-between"><span>Preço Ideal ({result.desiredProfitMargin}% Lucro):</span> <strong className="text-green-500">{result.formattedIdealPrice}</strong></p>
                        <p className="flex justify-between"><span>Preço Concorrente:</span> <strong>{result.formattedCompetitorPrice}</strong></p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

interface ListItemProps {
    label: string;
    value: string;
    isNegative?: boolean;
    isBold?: boolean;
    isProfit?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ label, value, isNegative, isBold, isProfit }) => (
    <li className={`flex justify-between items-center ${isBold ? 'font-bold' : ''}`}>
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className={isProfit !== undefined ? (isProfit ? 'text-green-500' : 'text-red-500') : (isNegative ? 'text-red-400' : 'text-gray-800 dark:text-gray-100')}>
            {isNegative ? `- ${value}` : value}
        </span>
    </li>
);

export default ResultsDisplay;
