import * as LucideIcons from "lucide-react";

export interface IButtonProps {
  iconName?: keyof typeof LucideIcons;
  label?: string;
  disabled?: boolean;
  onClick: () => void;
}