export interface User {
  id: number;
  email: string;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  roles?: string[]; // e.g. ['ADMIN','USER']
}

export type Role = 'ADMIN' | 'USER';
