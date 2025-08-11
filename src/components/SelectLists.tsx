import React, { useState, useEffect } from 'react';
import apiData from './url.json';

interface Organization {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface Bill {
  id: number;
  name: string;
  balance: number;
  currency: string;
}

interface PriceType {
  id: number;
  name: string;
}

interface SelectListsProps {
  token: string;
  onComplete: () => void;
  onBillSelect: (bill: Bill) => void;
  onOrgSelect: (org: Organization) => void;
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onPriceTypeSelect: (priceType: PriceType) => void;
}

const SelectLists: React.FC<SelectListsProps> = ({
  onComplete,
  onBillSelect,
  onOrgSelect,
  onWarehouseSelect,
  onPriceTypeSelect,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Извлекаем уникальные организации из API данных
  const extractOrganizations = (): Organization[] => {
    const orgsMap = new Map<number, Organization>();
    
    apiData.result.forEach(order => {
      if (order.organization) {
        orgsMap.set(order.organization, {
          id: order.organization,
          name: order.organization_name || `Организация ${order.organization}`
        });
      }
    });

    return Array.from(orgsMap.values());
  };

  // Извлекаем уникальные склады из API данных
  const extractWarehouses = (): Warehouse[] => {
    const warehousesMap = new Map<number, Warehouse>();
    
    apiData.result.forEach(order => {
      if (order.warehouse) {
        warehousesMap.set(order.warehouse, {
          id: order.warehouse,
          name: order.warehouse_name || `Склад ${order.warehouse}`
        });
      }
    });

    return Array.from(warehousesMap.values());
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Загружаем организации и склады из API
        const orgs = extractOrganizations();
        const whs = extractWarehouses();
        
        // Моки для счетов и типов цен (можно заменить на API)
        const mockBills: Bill[] = [
          {
            id: 1,
            name: "Основной счет",
            balance: 100000,
            currency: "RUB"
          },
          {
            id: 2,
            name: "Резервный счет",
            balance: 50000,
            currency: "RUB"
          }
        ];

        const mockPriceTypes: PriceType[] = [
          { id: 1, name: "Розничная цена" },
          { id: 2, name: "Оптовая цена" },
          { id: 3, name: "Партнерская цена" }
        ];

        setOrganizations(orgs);
        setWarehouses(whs);
        setBills(mockBills);
        setPriceTypes(mockPriceTypes);

        // Устанавливаем первые значения по умолчанию
        if (orgs.length > 0) onOrgSelect(orgs[0]);
        if (whs.length > 0) onWarehouseSelect(whs[0]);
        if (mockBills.length > 0) onBillSelect(mockBills[0]);
        if (mockPriceTypes.length > 0) onPriceTypeSelect(mockPriceTypes[0]);

      } catch (err) {
        setError('Не удалось загрузить параметры');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  if (loading) return <div className="loading">Загрузка параметров...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Выберите параметры</h2>

      <div className="input-group">
        <label>Организация:</label>
        <select 
          onChange={(e) => {
            const org = organizations.find(o => o.id === Number(e.target.value));
            if (org) onOrgSelect(org);
          }}
        >
          {organizations.map(org => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Счет:</label>
        <select 
          onChange={(e) => {
            const bill = bills.find(b => b.id === Number(e.target.value));
            if (bill) onBillSelect(bill);
          }}
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
          onChange={(e) => {
            const warehouse = warehouses.find(w => w.id === Number(e.target.value));
            if (warehouse) onWarehouseSelect(warehouse);
          }}
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
          onChange={(e) => {
            const priceType = priceTypes.find(p => p.id === Number(e.target.value));
            if (priceType) onPriceTypeSelect(priceType);
          }}
        >
          {priceTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          Продолжить
        </button>
      </div>
    </form>
  );
};

export default SelectLists;