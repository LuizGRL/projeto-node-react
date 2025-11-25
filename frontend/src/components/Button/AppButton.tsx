import type { IButtonProps } from "../../types/interfaces/IButtonProps";

function AppButton({label, onClick, disabled} : IButtonProps) {
    return(
    <button onClick={onClick} disabled={disabled}
    className={`flex items-center gap-2 p-2 bg-blue-500 text-white cursor-pointer rounded-[6px] ml-[10px]
    ${disabled ? 'opacity-50 cursor-not-allowed hover:opacity-50' : 'hover:opacity-70'}`}>      
        {label}
    </button>
    );
}

export default AppButton;