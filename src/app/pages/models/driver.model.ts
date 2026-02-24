export interface Driver {
  id: number;
  licenseNumber: string;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  } | null;
}
