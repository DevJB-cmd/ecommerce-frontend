import { Product } from './product.model';

export interface Order {
  id: number;
  date: string; // ISO
  total: number;
  status: string;
  client: number | null; // client id
  products: Product[];
}
