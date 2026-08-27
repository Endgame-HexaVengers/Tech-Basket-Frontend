export interface Supplier {
  id: string;
  name: string;
  location: string;
}

export interface Product {
  id: string;
  title: string;
  defaultPrice: number;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export const DUMMY_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'ABC Computer Ltd.', location: 'Dhaka, Bangladesh' },
  { id: '2', name: 'Global Tech Solutions', location: 'Chittagong, Bangladesh' },
  { id: '3', name: 'Nexus Electronics', location: 'Dhaka, Bangladesh' },
  { id: '4', name: 'Prime IT Systems', location: 'Sylhet, Bangladesh' },
];

export const DUMMY_PRODUCTS: Product[] = [
  { id: 'p1', title: 'ThinkPad T14 Gen 3', defaultPrice: 125000 },
  { id: 'p2', title: 'Logitech MX Master 3S', defaultPrice: 8500 },
  { id: 'p3', title: "Dell UltraSharp 27' Monitor", defaultPrice: 45000 },
  { id: 'p4', title: "Apple MacBook Pro 14'", defaultPrice: 210000 },
];