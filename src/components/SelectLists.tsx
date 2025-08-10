import React, { useState, useEffect } from 'react';
import type { Bill, Organization, Warehouse, PriceType } from '../types';
import apiData from './api.json';

interface SelectListsProps {
  token: string;
  onComplete: () => void;
  onBillSelect: (bill: Bill) => void;
  onOrgSelect: (org: Organization) => void;
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onPriceTypeSelect: (priceType: PriceType) => void;
  clientId?: number;
}

const SelectLists: React.FC<SelectListsProps> = ({
  token,
  onComplete,
  onBillSelect,
  onOrgSelect,
  onWarehouseSelect,
  onPriceTypeSelect,
  clientId
}) => {
  // Состояния для хранения данных
  const [bills, setBills] = useState<Bill[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояния для выбранных значений
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedPriceTypeId, setSelectedPriceTypeId] = useState<number | null>(null);

  // Извлекаем организации из API данных
  const extractOrganizations = (): Organization[] => {
    const orgsMap = new Map<number, Organization>();
    
    apiData.result.forEach(order => {
      if (order.organization && !orgsMap.has(order.organization)) {
        orgsMap.set(order.organization, {
          id: order.organization,
          name: `Организация ${order.organization}`
        });
      }
    });

    return Array.from(orgsMap.values());
  };

  // Извлекаем склады из API данных
  const extractWarehouses = (): Warehouse[] => {
    const warehousesMap = new Map<number, Warehouse>();
    
    apiData.result.forEach(order => {
      if (order.warehouse && !warehousesMap.has(order.warehouse)) {
        warehousesMap.set(order.warehouse, {
          id: order.warehouse,
          name: `Склад ${order.warehouse}`
        });
      }
    });

    return Array.from(warehousesMap.values());
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Извлекаем данные из API
      const organizations = extractOrganizations();
      const warehouses = extractWarehouses();

      // Простые моки для данных, которых нет в API
      const defaultBills: Bill[] = [
        {
          id: 1,
          name: "Основной счет",
          balance: 100000,
          currency: "RUB"
        }
      ];

      const defaultPriceTypes: PriceType[] = [
        {
          id: 1,
          name: "Розничная цена"
        },
        {
          id: 2,
          name: "Оптовая цена"
        }
      ];

      setOrgs(organizations);
      setWarehouses(warehouses);
      setBills(defaultBills);
      setPriceTypes(defaultPriceTypes);

      // Устанавливаем первые значения по умолчанию
      if (organizations.length > 0) {
        setSelectedOrgId(organizations[0].id);
        onOrgSelect(organizations[0]);
      }
      if (warehouses.length > 0) {
        setSelectedWarehouseId(warehouses[0].id);
        onWarehouseSelect(warehouses[0]);
      }
      if (defaultBills.length > 0) {
        setSelectedBillId(defaultBills[0].id);
        onBillSelect(defaultBills[0]);
      }
      if (defaultPriceTypes.length > 0) {
        setSelectedPriceTypeId(defaultPriceTypes[0].id);
        onPriceTypeSelect(defaultPriceTypes[0]);
      }

    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить справочники');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, что все обязательные поля выбраны
    if (!selectedOrgId || !selectedBillId || !selectedWarehouseId || !selectedPriceTypeId) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    onComplete();
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="form-container">
        <h2>Ошибка</h2>
        <div className="error-message">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="submit-button"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Выберите параметры</h2>

      <div className="input-group">
        <label>Организация:</label>
        <select 
          value={selectedOrgId || ''}
          onChange={(e) => {
            const orgId = Number(e.target.value);
            const org = orgs.find(o => o.id === orgId);
            if (org) {
              setSelectedOrgId(orgId);
              onOrgSelect(org);
            }
          }}
          required
        >
          {orgs.map(org => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Счет:</label>
        <select 
          value={selectedBillId || ''}
          onChange={(e) => {
            const billId = Number(e.target.value);
            const bill = bills.find(b => b.id === billId);
            if (bill) {
              setSelectedBillId(billId);
              onBillSelect(bill);
            }
          }}
          required
        >
          {bills.map(bill => (
            <option key={bill.id} value={bill.id}>
              {bill.name} ({bill.balance} {bill.currency})
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Склад:</label>
        <select 
          value={selectedWarehouseId || ''}
          onChange={(e) => {
            const warehouseId = Number(e.target.value);
            const warehouse = warehouses.find(w => w.id === warehouseId);
            if (warehouse) {
              setSelectedWarehouseId(warehouseId);
              onWarehouseSelect(warehouse);
            }
          }}
          required
        >
          {warehouses.map(warehouse => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Тип цены:</label>
        <select 
          value={selectedPriceTypeId || ''}
          onChange={(e) => {
            const priceTypeId = Number(e.target.value);
            const priceType = priceTypes.find(p => p.id === priceTypeId);
            if (priceType) {
              setSelectedPriceTypeId(priceTypeId);
              onPriceTypeSelect(priceType);
            }
          }}
          required
        >
          {priceTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" className="submit-button">
          Продолжить
        </button>
      </div>
    </form>
  );
};

export default SelectLists;
