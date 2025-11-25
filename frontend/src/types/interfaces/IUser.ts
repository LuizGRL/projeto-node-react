import type { ERoles } from "../enums/ERoles";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: ERoles; 
  createdAt?: string;
  active: boolean;
}