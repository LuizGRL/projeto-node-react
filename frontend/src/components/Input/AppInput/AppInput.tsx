import { InputWrapper } from "../styles";
import type { IInputProps } from "../../../types/interfaces/IInputProps";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function AppInput({
    label, 
    value,      
    onChange,   
    min, 
    max, 
    disabled, 
    placeholder, 
    required, 
    titleCase, 
    cpf,
    type = "text"
}: IInputProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        if (titleCase && !cpf) {
            inputValue = toTitleCase(inputValue);
        }

        if (cpf) {
            inputValue = inputValue.replace(/\D/g, "");
            
            if (inputValue.length > 11) {
                 inputValue = inputValue.slice(0, 11);
            }

            inputValue = inputValue.replace(/(\d{3})(\d)/, "$1.$2");
            inputValue = inputValue.replace(/(\d{3})(\d)/, "$1.$2");
            inputValue = inputValue.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }

        onChange(inputValue); 
    };

    return(
        <InputWrapper>
            <label className="block mb-1 font-semibold text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <input 
                className="bg-white border border-black rounded p-2 w-full" 
                type={type}
                min={min} 
                max={cpf ? 14 : max}
                maxLength={cpf ? 14 : undefined} 
                disabled={disabled}
                placeholder={placeholder} 
                required={required}
                value={value} 
                onChange={handleChange}
            >
            </input>
        </InputWrapper>
    );
}

export default AppInput;