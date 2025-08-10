import * as React from 'react';
import { useState } from 'react';

interface ClientSearchProps {
  token: string;
  onSelect: (client: any) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ token, onSelect }) => {
  const [phone, setPhone] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsLoading(true);
    try {
      // Здесь должен быть реальный запрос к API
      // const response = await searchClientsByPhone(token, phone);
      // Имитация API запроса
      setTimeout(() => {
        setClients([
          { id: 1, name: 'Иванов Иван', phone: phone },
          { id: 2, name: 'Петров Петр', phone: phone }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
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
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Поиск...' : 'Найти'}
        </button>
      </form>

      {clients.length > 0 && (
        <div className="results-container">
          <h3>Найдены клиенты:</h3>
          <ul className="client-list">
            {clients.map(client => (
              <li key={client.id} onClick={() => onSelect(client)}>
                <div>{client.name}</div>
                <div>{client.phone}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientSearch;
