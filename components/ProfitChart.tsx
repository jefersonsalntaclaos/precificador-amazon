
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { PricingResult } from '../services/pricingCalculator';

interface ProfitChartProps {
    result: PricingResult;
}

const COLORS = {
    profit: '#10B981', // green-500
    amazonFees: '#F59E0B', // amber-500
    taxes: '#EF4444', // red-500
    productCost: '#3B82F6', // blue-500
};

const ProfitChart: React.FC<ProfitChartProps> = ({ result }) => {
    const data = [
        { name: 'Lucro Líquido', value: Math.max(0, result.netProfitPerUnit) },
        { name: 'Taxas Amazon', value: result.totalAmazonFees },
        { name: 'Impostos e Taxas', value: result.totalTaxes },
        { name: 'Custo do Produto', value: result.baseProductCost },
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        <Cell key={`cell-profit`} fill={COLORS.profit} />
                        <Cell key={`cell-amazonFees`} fill={COLORS.amazonFees} />
                        <Cell key={`cell-taxes`} fill={COLORS.taxes} />
                        <Cell key={`cell-productCost`} fill={COLORS.productCost} />
                    </Pie>
                    <Tooltip formatter={(value: number) => result.currencyFormatter.format(value)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfitChart;
