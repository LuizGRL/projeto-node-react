import type { LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { IButtonProps } from "../../types/interfaces/IButtonProps";

export default function AppIconButton({ iconName, label, onClick, disabled }: IButtonProps) {

  if (!iconName) {
    return null;
  }

  const Icon = LucideIcons[iconName] as React.FC<LucideProps>;

  if (!Icon) {
    return null;
  }

  return (
    <button onClick={onClick} 
    disabled={disabled} className={`flex items-center gap-2 p-2 bg-blue-500 text-white cursor-pointer rounded-[6px]
    ${disabled ? 'opacity-50 cursor-not-allowed hover:opacity-50' : 'hover:opacity-70'}`}>      
      <Icon size={20} />
      {label && <span>{label}</span>}
    </button>
  );
}
