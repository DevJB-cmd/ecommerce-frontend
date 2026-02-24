export interface Subcategory {
  id: number;
  name: string;
  category?: { id: number; name?: string } | null;
}
