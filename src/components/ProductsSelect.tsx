import React, { useState, useEffect } from 'react';
import apiData from './api.json';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedPrice?: number;
  categoryId?: number;
  barcode?: string;
  image?: string;
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

  // Моковые данные товаров
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Букет роз",
      price: 2500,
      quantity: 10,
      categoryId: 1,
      barcode: "123456789",
      image: "https://example.com/rose.jpg"
    },
    {
      id: 2,
      name: "Букет тюльпанов",
      price: 1800,
      quantity: 15,
      categoryId: 1,
      barcode: "987654321",
      image: "https://example.com/tulip.jpg"
    },
    {
      id: 3,
      name: "Коробка конфет",
      price: 1200,
      quantity: 8,
      categoryId: 2,
      barcode: "456123789",
      image: "https://example.com/candy.jpg"
    }
  ];

  // Функции для работы с товарами
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveProduct(productId);
      return;
    }
    
    onSelect(selectedProducts.map(product =>
      product.id === productId ? { ...product, quantity: newQuantity } : product
    ));
  };

  const handleRemoveProduct = (productId: number) => {
    onSelect(selectedProducts.filter(product => product.id !== productId));
  };

  const handlePriceChange = (productId: number, newPrice: number) => {
    onSelect(selectedProducts.map(product =>
      product.id === productId ? { ...product, selectedPrice: newPrice } : product
    ));
  };

  const handleAddProduct = (product: Product) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    
    if (existing) {
      handleQuantityChange(product.id, existing.quantity + 1);
    } else {
      onSelect([...selectedProducts, { 
        ...product, 
        quantity: 1,
        selectedPrice: product.price
      }]);
    }
  };

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Пытаемся получить товары из API
        const apiProducts = apiData.result.flatMap((order: any) => 
          order.goods ? order.goods.map((g: any) => ({
            id: g.id,
            name: g.name || `Товар ${g.id}`,
            price: g.price || 0,
            quantity: g.quantity || 0,
            categoryId: g.category_id,
            barcode: g.barcode || '',
            image: g.image_url || ''
          })) : []
        );
        
        setProducts(apiProducts.length > 0 ? apiProducts : mockProducts);
        
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        setError('Не удалось загрузить товары. Используем демо-данные.');
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, warehouseId]);

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const totalSum = selectedProducts.reduce(
    (sum, product) => sum + ((product.selectedPrice || product.price) * product.quantity), 
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

        {categories.length > 0 && (
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
        )}
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
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
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