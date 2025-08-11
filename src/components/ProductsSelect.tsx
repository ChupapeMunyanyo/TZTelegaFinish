import React, { useState, useEffect } from 'react';
import apiData from './url.json';

// Точное описание структуры товара из API
interface ApiProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
  image?: string;  // В вашем API это поле называется image
}

// Тип для товара в нашем компоненте
interface Product extends Omit<ApiProduct, 'image'> {
  selectedPrice?: number;
  categoryId?: number;
  imageUrl?: string;
}

interface ProductsSelectProps {
  token: string;
  products: Product[];
  onSelect: (products: Product[]) => void;
  onComplete: () => void;
  warehouseId?: number;
}

const ProductsSelect: React.FC<ProductsSelectProps> = ({
  token,
  products: selectedProducts,
  onSelect,
  onComplete,
  warehouseId
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [categories] = useState([
    { id: 1, name: "Цветы" },
    { id: 2, name: "Подарки" }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Обработчики для работы с товарами
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const updatedProducts = selectedProducts.map(product =>
      product.id === productId ? { ...product, quantity: Math.max(1, newQuantity) } : product
    );
    onSelect(updatedProducts);
  };

  const handleRemoveProduct = (productId: number) => {
    onSelect(selectedProducts.filter(product => product.id !== productId));
  };

  const handlePriceChange = (productId: number, newPrice: number) => {
    onSelect(selectedProducts.map(product =>
      product.id === productId ? { ...product, selectedPrice: Math.max(1, newPrice) } : product
    ));
  };

  const handleAddProduct = (product: Product) => {
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex].quantity += 1;
      onSelect(updatedProducts);
    } else {
      onSelect([...selectedProducts, { 
        ...product, 
        quantity: 1,
        selectedPrice: product.price
      }]);
    }
  };

  // Загрузка и обработка товаров
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Обрабатываем данные из API
        const productMap = new Map<number, Product>();
        
        apiData.result.forEach(order => {
          if (order.goods?.length) {
            order.goods.forEach((good: ApiProduct) => {
              if (!productMap.has(good.id)) {
                const categoryId = good.name.includes('Букет') ? 1 : 
                                 good.name.includes('Коробка') ? 2 : undefined;
                
                productMap.set(good.id, {
                  ...good,
                  categoryId,
                  imageUrl: good.image,  // Переносим image в imageUrl
                  barcode: good.barcode || ''
                });
              }
            });
          }
        });

        setProducts(Array.from(productMap.values()));
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [token, warehouseId]);

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.barcode.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Подсчет общей суммы
  const totalSum = selectedProducts.reduce(
    (sum, product) => sum + (product.selectedPrice || product.price) * product.quantity, 
    0
  );

  return (
    <div className="form-container">
      <h2>Выберите товары</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="search-controls">
        <div className="input-group">
          <label>Поиск товаров:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите название или штрих-код"
          />
        </div>

        <div className="input-group">
          <label>Категория:</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(
              e.target.value ? Number(e.target.value) : null
            )}
          >
            <option value="">Все категории</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <>
          <div className="products-grid">
            <div className="available-products">
              <h3>Доступные товары ({filteredProducts.length})</h3>
              {filteredProducts.length === 0 ? (
                <div className="no-results">Товары не найдены</div>
              ) : (
                <div className="products-container">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">🛒</div>
                        )}
                      </div>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">{product.price} ₽</div>
                        <div className="product-stock">
                          Остаток: {product.quantity} шт.
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddProduct(product)}
                        className="add-button"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="selected-products">
              <h3>Выбранные товары ({selectedProducts.length})</h3>
              {selectedProducts.length === 0 ? (
                <div className="no-results">Товары не выбраны</div>
              ) : (
                <div className="selected-list">
                  {selectedProducts.map(product => (
                    <div key={product.id} className="selected-item">
                      <div className="product-main">
                        <div className="product-name">{product.name}</div>
                        <div className="price-control">
                          <input
                            type="number"
                            value={product.selectedPrice || product.price}
                            onChange={(e) => 
                              handlePriceChange(product.id, Number(e.target.value))
                            }
                            min="1"
                            step="1"
                          />
                          <span>₽</span>
                        </div>
                      </div>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{product.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                        >
                          +
                        </button>
                        <button 
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="product-sum">
                        {((product.selectedPrice || product.price) * product.quantity).toFixed(2)} ₽
                      </div>
                    </div>
                  ))}
                  <div className="total-sum">
                    Итого: {totalSum.toFixed(2)} ₽
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              onClick={onComplete}
              className="submit-button"
              disabled={selectedProducts.length === 0}
            >
              Продолжить
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsSelect;