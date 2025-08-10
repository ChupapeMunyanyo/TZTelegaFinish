
export interface Order {
  id: number;
  number: string;
  dated: number;
  contragent?: number;
  contragent_name?: string;
  tags?: string;
  sum: number;
  paid_rubles: number;
  paid_loyality: number;
  status: boolean;
  organization: number;
  warehouse?: number;
  updated_at: number;
  created_at: number;
  has_contragent: boolean;
  has_loyality_card: boolean;
  color_status: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  ordersCount: number;
  lastOrderDate: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  categoryId?: number;
  barcode?: string;
  image?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
  inn?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  address?: string;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface Bill {
  id: number;
  name: string;
  balance: number;
  currency: string;
}