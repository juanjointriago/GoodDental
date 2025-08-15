export type Role = "administrator" | "employee" | "customer";
export type IDepartment =
  | "administration"
  | "medical"
  | "assistance"
  | "cleaning";

export interface IUser {
  id: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  name: string;
  cc: string;
  lastName: string;
  phone: string;
  role: Role;
  avatar?: string;
  photoURL?: string;
  address: string;
  birthDate: number;
  city: string;
  country: string;
  isActive: boolean;
  lastLogin?: number;
  createdAt?: number;
  updatedAt?: number;
}
