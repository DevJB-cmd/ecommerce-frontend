import { Product } from './product.model';

export interface Order {
  id: number;
  orderDate: string; // yyyy-MM-dd
  status: string;
  client?: { id: number; address?: string } | null;
  products?: Product[];
  // backward compatibility
  date?: string;
  total?: number;
}
