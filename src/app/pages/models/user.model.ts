export interface User {
  id: number;
  email: string;
  username?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  roles?: string[]; // e.g. ['ADMIN','USER']
}

export type Role = 'ADMIN' | 'USER';
