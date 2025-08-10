import React, { useState } from 'react';
import type { Client, Order } from '../types';
import apiData from './api.json';

interface ClientSearchProps {
  token: string;
  onSelect: (client: Client) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ onSelect }) => {
  const [phone, setPhone] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Нормализация номера телефона (удаляем всё, кроме цифр)
  const normalizePhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  // Извлечение телефона из тегов
  const extractPhoneFromTags = (tags: string | null): string | null => {
    if (!tags) return null;
    
    // Ищем шаблон USERPHONE_XXXXXXXXXX
    const phoneMatch = tags.match(/USERPHONE_(\d+)/);
    return phoneMatch ? phoneMatch[1] : null;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('Введите номер телефона');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const normalizedPhone = normalizePhone(phone);
      const orders = apiData.result as Order[];

      if (!orders || orders.length === 0) {
        setError('Клиенты не найдены');
        setClients([]);
        return;
      }

      const clientMap = new Map<number, Client>();
      const foundClients: Client[] = [];
      
      orders.forEach((order) => {
        if (order.contragent && order.contragent_name) {
          const phoneFromTags = extractPhoneFromTags(order.tags || null);
          const clientPhone = phoneFromTags ? phoneFromTags : '';

          // Проверяем точное совпадение номера
          if (normalizePhone(clientPhone) === normalizedPhone) {
            const existingClient = clientMap.get(order.contragent);
            
            if (!existingClient) {
              const newClient = {
                id: order.contragent,
                name: order.contragent_name,
                phone: clientPhone,
                ordersCount: 1,
                lastOrderDate: order.dated
              };
              clientMap.set(order.contragent, newClient);
              foundClients.push(newClient);
            } else {
              existingClient.ordersCount++;
              if (order.dated > existingClient.lastOrderDate) {
                existingClient.lastOrderDate = order.dated;
              }
            }
          }
        }
      });

      // Сортируем по дате последнего заказа (новые сначала)
      const sortedClients = foundClients.sort((a, b) => b.lastOrderDate - a.lastOrderDate);
      
      if (sortedClients.length === 0) {
        setError('Клиент с таким номером не найден');
      }

      setClients(sortedClients);
    } catch (err) {
      console.error('Ошибка поиска клиентов:', err);
      setError('Ошибка при поиске клиентов');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Поиск клиента</h2>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <label>Телефон клиента:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError(null);
            }}
            placeholder="+7 (___) ___-__-__"
            required
            pattern="^(\+7|8)[0-9]{10}$"
          />
        </div>
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Поиск...' : 'Найти'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {clients.length > 0 && (
        <div className="results-container">
          <h3>Найдены клиенты:</h3>
          <ul className="client-list">
            {clients.map(client => (
              <li 
                key={client.id} 
                onClick={() => onSelect(client)}
                className="client-item"
              >
                <div className="client-name">{client.name}</div>
                <div className="client-phone">{
                  client.phone.startsWith('+') ? 
                  client.phone : 
                  `+${client.phone}`
                }</div>
                <div className="client-orders">
                  Заказов: {client.ordersCount} | 
                  Последний: {new Date(client.lastOrderDate * 1000).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientSearch;
