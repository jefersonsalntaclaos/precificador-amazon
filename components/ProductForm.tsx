
import React from 'react';
import type { ProductInput } from '../types';
import Input from './Input';
import Select from './Select';
import Card from './Card';
import Toggle from './Toggle';
import { AMAZON_CATEGORIES, AMAZON_MARKETPLACES } from '../constants';
import { DollarSign, Box, Percent, Truck, Building, MapPin, Tag, SlidersHorizontal, Calculator } from 'lucide-react';

interface ProductFormProps {
    productInput: ProductInput;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSliderChange: (value: number) => void;
}

const Section: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({ title, icon, children }) => (
    <div className="mb-8">
        <div className="flex items-center mb-4">
            <span className="text-blue-500 mr-3">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);


const ProductForm: React.FC<ProductFormProps> = ({ productInput, onInputChange, onSliderChange }) => {
    const marketplaceInfo = AMAZON_MARKETPLACES[productInput.amazonMarketplace];

    return (
        <Card title="Cadastro e Simulação de Produto" icon={<SlidersHorizontal size={24}/>}>
            <form className="space-y-6">
                <Section title="Custos do Produto" icon={<DollarSign size={20}/>}>
                    <Input label="Custo do Produto" name="productCost" type="number" value={productInput.productCost} onChange={onInputChange} step="0.01" />
                    <Input label="Frete Internacional" name="internationalShippingCost" type="number" value={productInput.internationalShippingCost} onChange={onInputChange} step="0.01" />
                    <Input label="Seguro" name="insurance" type="number" value={productInput.insurance} onChange={onInputChange} step="0.01" />
                    <Input label="Custo da Embalagem" name="packagingCost" type="number" value={productInput.packagingCost} onChange={onInputChange} step="0.01" />
                </Section>
                
                <Section title="Dimensões e Peso" icon={<Box size={20}/>}>
                    <Input label={`Peso (${marketplaceInfo.weightUnit})`} name="weight" type="number" value={productInput.weight} onChange={onInputChange} step="0.01" />
                    <Input label={`Comprimento (${marketplaceInfo.dimensionUnit})`} name="length" type="number" value={productInput.length} onChange={onInputChange} step="0.1" />
                    <Input label={`Largura (${marketplaceInfo.dimensionUnit})`} name="width" type="number" value={productInput.width} onChange={onInputChange} step="0.1" />
                    <Input label={`Altura (${marketplaceInfo.dimensionUnit})`} name="height" type="number" value={productInput.height} onChange={onInputChange} step="0.1" />
                </Section>

                <Section title="Configurações Amazon" icon={<Building size={20}/>}>
                    <Select label="País da Amazon" name="amazonMarketplace" value={productInput.amazonMarketplace} onChange={onInputChange}
                        options={Object.keys(AMAZON_MARKETPLACES).map(key => ({ value: key, label: key }))}
                    />
                    <Select label="Categoria do Produto" name="amazonCategory" value={productInput.amazonCategory} onChange={onInputChange}
                        options={Object.keys(AMAZON_CATEGORIES).map(cat => ({ value: cat, label: cat }))}
                    />
                     <Select label="Tipo de Envio" name="fulfillmentType" value={productInput.fulfillmentType} onChange={onInputChange}
                        options={[{value: 'FBA', label: 'FBA'}, {value: 'FBM', label: 'FBM'}, {value: 'DBA', label: 'DBA'}]}
                    />
                </Section>
                 <Section title="Impostos e Taxas (Avançado)" icon={<Percent size={20}/>}>
                    <div className="col-span-full">
                         <Toggle name="includeTaxes" label="Calcular Impostos" checked={productInput.includeTaxes} onChange={onInputChange} />
                    </div>
                    {productInput.includeTaxes && (
                        <>
                            <Input label="Imposto de Importação" name="importTaxRate" type="number" value={productInput.importTaxRate} onChange={onInputChange} unit="%" />
                            <Input label="ICMS / VAT" name="vatRate" type="number" value={productInput.vatRate} onChange={onInputChange} unit="%" />
                            <Input label="Taxas Alfandegárias (fixo)" name="customsFee" type="number" value={productInput.customsFee} onChange={onInputChange} />
                        </>
                    )}
                </Section>

                 <Section title="Estratégia de Preço" icon={<Calculator size={20}/>}>
                     <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Margem de Lucro Desejada: <span className="font-bold text-blue-500">{productInput.desiredProfitMargin}%</span></label>
                        <input type="range" min="0" max="100" value={productInput.desiredProfitMargin} onChange={(e) => onSliderChange(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>
                    <Input label="Preço Médio da Concorrência" name="competitorPrice" type="number" value={productInput.competitorPrice} onChange={onInputChange} step="0.01" />
                     <Input label="Vendas Mensais Estimadas" name="estimatedMonthlySales" type="number" value={productInput.estimatedMonthlySales} onChange={onInputChange} step="1" />
                </Section>
            </form>
        </Card>
    );
};

export default ProductForm;
