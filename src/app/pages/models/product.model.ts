export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  // Backward-compatible fields still used in some screens/templates
  stock?: number;
  description?: string;
  imageUrl?: string;
  category?: number | null;
  provider?: { id: number; companyName?: string } | null;
  subCategory?: { id: number; name?: string } | null;
}
