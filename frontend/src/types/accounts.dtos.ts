export interface ICreateAccountDTO {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  cpf: string;
  birthDate: Date | string; 
  role: "ADMIN" | "LIBRARIAN" | "USER" | "CUSTOMER"; 
}

export interface IAccountResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}