export interface Client {
  id: number;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
  address: string;
}
