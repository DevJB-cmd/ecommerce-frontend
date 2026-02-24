export interface Provider {
  id: number;
  companyName?: string;
  // Backward-compatible aliases
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
}
