import React, { useState } from 'react';
import TokenForm from './components/TokenForm';
import ClientSearch from './components/ClientSearch';
import SelectLists from './components/SelectLists';
import ProductsSelect from './components/ProductsSelect';
import SubmitButtons from './components/SubmitButtons';
import { createSale, createAndPostSale } from './api';

const App: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [client, setClient] = useState<any>(null);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [selectedPriceType, setSelectedPriceType] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [step, setStep] = useState<number>(1);

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleChangeToken = () => {
    setToken('');
    setStep(1);
    resetForm();
  };

  const resetForm = () => {
    setClient(null);
    setSelectedBill(null);
    setSelectedOrg(null);
    setSelectedWarehouse(null);
    setSelectedPriceType(null);
    setSelectedProducts([]);
  };

  const handleTokenSubmit = (token: string) => {
    setToken(token);
    setStep(2);
  };

  const handleClientSelect = (client: any) => {
    setClient(client);
    setStep(3);
  };

  const handleParametersSelect = () => {
    setStep(4);
  };

  const handleProductsSelect = () => {
    setStep(5);
  };

  const handleCreateSale = async () => {
    try {
      const saleData = prepareSaleData();
      await createSale(token, saleData);
      alert('Продажа успешно создана!');
      resetForm();
      setStep(2);
    } catch (error) {
      alert('Ошибка при создании продажи');
    }
  };

  const handleCreateAndPostSale = async () => {
    try {
      const saleData = prepareSaleData();
      await createAndPostSale(token, saleData);
      alert('Продажа успешно создана и проведена!');
      resetForm();
      setStep(2);
    } catch (error) {
      alert('Ошибка при создании и проведении продажи');
    }
  };

  const prepareSaleData = () => {
    return {
      client_id: client?.id,
      bill_id: selectedBill?.id,
      organization_id: selectedOrg?.id,
      warehouse_id: selectedWarehouse?.id,
      price_type_id: selectedPriceType?.id,
      products: selectedProducts.map(p => ({
        product_id: p.id,
        quantity: p.quantity,
        price: p.price
      }))
    };
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Авторизация';
      case 2: return 'Поиск клиента';
      case 3: return 'Выбор параметров';
      case 4: return 'Выбор товаров';
      case 5: return 'Подтверждение';
      default: return '';
    }
  };

  return (
    <div className="app-container">
      {step > 1 && (
        <div className="app-header">
          <button onClick={handleBack} className="back-button">
            ← Назад
          </button>
          <h2 className="step-title">{getStepTitle()}</h2>
          <button onClick={handleChangeToken} className="change-token-button">
            Токен
          </button>
        </div>
      )}

      <div className="form-content">
        {step === 1 && <TokenForm onSubmit={handleTokenSubmit} />}
        {step === 2 && <ClientSearch token={token} onSelect={handleClientSelect} />}
        {step === 3 && (
          <SelectLists
            token={token}
            onComplete={handleParametersSelect}
            onBillSelect={setSelectedBill}
            onOrgSelect={setSelectedOrg}
            onWarehouseSelect={setSelectedWarehouse}
            onPriceTypeSelect={setSelectedPriceType}
          />
        )}
        {step === 4 && (
          <ProductsSelect
            token={token}
            products={selectedProducts}
            onSelect={setSelectedProducts}
            onComplete={handleProductsSelect}
          />
        )}
        {step === 5 && (
          <SubmitButtons
            onCreate={handleCreateSale}
            onCreateAndPost={handleCreateAndPostSale}
          />
        )}
      </div>
    </div>
  );
};

export default App;

