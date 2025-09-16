export type UserRole = 'Owner' | 'Admin' | 'User';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Password should not be stored in the frontend state long-term
}