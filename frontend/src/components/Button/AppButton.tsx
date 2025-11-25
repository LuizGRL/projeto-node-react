import type { IButtonProps } from "../../types/interfaces/IButtonProps";

function AppButton({ 
    children, 
    disabled, 
    loading, 
    variant = 'primary',
    className = '', 
    ...rest 
} : IButtonProps) {

    const variants = {
        primary: "bg-primary text-black border-transparent text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent",
        danger: "bg-danger hover:bg-red-700 text-white border-transparent",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
    };

    return(
        <button 
            disabled={disabled || loading}
            className={`
                flex items-center justify-center gap-2 p-2 rounded-md transition-all font-medium
                ${variants[variant]} 
                ${(disabled || loading) ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'}
                ${className}
            `}
            {...rest}
        >      
            {loading ? (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                children
            )}
        </button>
    );
}

export default AppButton;