interface SaleData {
  client_id?: number;
  bill_id: number;
  organization_id: number;
  warehouse_id: number;
  price_type_id: number;
  products: Array<{
    product_id: number;
    quantity: number;
    price: number;
    discount?: number;
  }>;
  comment?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const createSale = async (token: string, data: SaleData): Promise<ApiResponse> => {
  try {
    const response = await fetch('https://your-api-url.com/sales', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        status: 'draft'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка создания продажи');
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating sale:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
};

export const createAndPostSale = async (token: string, data: SaleData): Promise<ApiResponse> => {
  try {
    const response = await fetch('https://your-api-url.com/sales', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        status: 'completed'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка создания и проведения продажи');
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating and posting sale:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
};

export const fetchClientInfo = async (token: string, clientId: number) => {
  const response = await fetch(`https://your-api-url.com/clients/${clientId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const fetchProductStock = async (token: string, productId: number, warehouseId: number) => {
  const response = await fetch(
    `https://your-api-url.com/products/${productId}/stock?warehouse=${warehouseId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
};

export const fetchPriceTypes = async (token: string, clientId?: number) => {
  const url = clientId 
    ? `https://your-api-url.com/price_types?client_id=${clientId}`
    : 'https://your-api-url.com/price_types';
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const preparePrintForm = (saleId: number, token: string) => {
  return `https://your-api-url.com/sales/${saleId}/print?token=${token}`;
};

export const sendReceiptToEmail = async (saleId: number, email: string, token: string) => {
  const response = await fetch(
    `https://your-api-url.com/sales/${saleId}/send_receipt`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    }
  );
  return response.json();
};