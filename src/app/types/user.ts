export interface User {
    id: number;
    name: string;
    email: string;
    roles?: UserRole[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type UserRole = 'ADMIN' | 'USER' | 'SUPERADMIN';
  