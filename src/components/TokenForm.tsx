import React, { useState } from 'react';

interface TokenFormProps {
  onSubmit: (token: string) => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ onSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onSubmit(token);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Авторизация</h2>
      <div className="input-group">
        <label>Токен кассы:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Введите токен"
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Продолжить
      </button>
    </form>
  );
};

export default TokenForm;

