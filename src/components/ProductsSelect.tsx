import React, { useState, useEffect } from 'react';

interface ProductsSelectProps {
  token: string;
  products: any[];
  onSelect: (products: any[]) => void;
  onComplete: () => void;
}

const ProductsSelect: React.FC<ProductsSelectProps> = ({
  token,
  products: selectedProducts,
  onSelect,
  onComplete
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setTimeout(() => {
          setProducts([
            { id: 1, name: 'Товар 1', price: 100 },
            { id: 2, name: 'Товар 2', price: 200 },
            { id: 3, name: 'Товар 3', price: 300 },
            { id: 4, name: 'Товар 4', price: 400 }
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleAddProduct = (product: any) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      onSelect(selectedProducts.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      onSelect([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    onSelect(selectedProducts.filter(p => p.id !== productId));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    onSelect(selectedProducts.map(p =>
      p.id === productId ? { ...p, quantity } : p
    ));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container">
      <h2>Выберите товары</h2>

      <div className="input-group">
        <label>Поиск товаров:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Введите название товара"
        />
      </div>

      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <>
          <div className="products-list">
            <h3>Доступные товары:</h3>
            {filteredProducts.length === 0 ? (
              <div>Товары не найдены</div>
            ) : (
              <ul>
                {filteredProducts.map(product => (
                  <li key={product.id}>
                    <div>
                      <span>{product.name}</span>
                      <span>{product.price} руб.</span>
                    </div>
                    <button onClick={() => handleAddProduct(product)}>+</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="selected-products">
            <h3>Выбранные товары:</h3>
            {selectedProducts.length === 0 ? (
              <div>Товары не выбраны</div>
            ) : (
              <ul>
                {selectedProducts.map(product => (
                  <li key={product.id}>
                    <div>
                      <span>{product.name}</span>
                      <span>{product.price} руб. x {product.quantity}</span>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(product.id, product.quantity - 1)}>-</button>
                      <span>{product.quantity}</span>
                      <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => handleRemoveProduct(product.id)}>×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={onComplete}
            className="submit-button"
            disabled={selectedProducts.length === 0}
          >
            Продолжить
          </button>
        </>
      )}
    </div>
  );
};

export default ProductsSelect;
