export interface IInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void; 
  type?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  titleCase?: boolean;
  cpf?: boolean;
}