interface SaleData {
  client_id?: number;
  bill_id?: number;
  organization_id?: number;
  warehouse_id?: number;
  price_type_id?: number;
  products: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

export const createSale = async (_token: string, data: SaleData) => {
  console.log('Creating sale with data:', data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export const createAndPostSale = async (_token: string, data: SaleData) => {
  console.log('Creating and posting sale with data:', data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};