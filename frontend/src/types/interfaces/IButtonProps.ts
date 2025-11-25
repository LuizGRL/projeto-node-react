import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode; 
    variant?: 'primary' | 'secondary' | 'danger' | 'outline'; 
    loading?: boolean;
}