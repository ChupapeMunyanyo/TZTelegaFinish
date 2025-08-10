import React, { useState, useEffect } from 'react';

interface SelectListsProps {
  token: string;
  onComplete: () => void;
  onBillSelect: (bill: any) => void;
  onOrgSelect: (org: any) => void;
  onWarehouseSelect: (warehouse: any) => void;
  onPriceTypeSelect: (priceType: any) => void;
}

const SelectLists: React.FC<SelectListsProps> = ({
  token,
  onComplete,
  onBillSelect,
  onOrgSelect,
  onWarehouseSelect,
  onPriceTypeSelect
}) => {
  const [bills, setBills] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [priceTypes, setPriceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setBills([
            { id: 1, name: 'Основной счет' },
            { id: 2, name: 'Дополнительный счет' }
          ]);
          setOrgs([
            { id: 1, name: 'ООО "Ромашка"' },
            { id: 2, name: 'ИП Иванов' }
          ]);
          setWarehouses([
            { id: 1, name: 'Основной склад' },
            { id: 2, name: 'Склад №2' }
          ]);
          setPriceTypes([
            { id: 1, name: 'Розничная' },
            { id: 2, name: 'Оптовая' }
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Выберите параметры</h2>

      <div className="input-group">
        <label>Счет:</label>
        <select onChange={(e) => onBillSelect(bills.find(b => b.id === +e.target.value))} required>
          <option value="">Выберите счет</option>
          {bills.map(bill => (
            <option key={bill.id} value={bill.id}>{bill.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Организация:</label>
        <select onChange={(e) => onOrgSelect(orgs.find(o => o.id === +e.target.value))} required>
          <option value="">Выберите организацию</option>
          {orgs.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Склад:</label>
        <select onChange={(e) => onWarehouseSelect(warehouses.find(w => w.id === +e.target.value))} required>
          <option value="">Выберите склад</option>
          {warehouses.map(warehouse => (
            <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Тип цены:</label>
        <select onChange={(e) => onPriceTypeSelect(priceTypes.find(p => p.id === +e.target.value))} required>
          <option value="">Выберите тип цены</option>
          {priceTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-button">
        Продолжить
      </button>
    </form>
  );
};

export default SelectLists;

