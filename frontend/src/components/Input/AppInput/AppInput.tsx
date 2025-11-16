import { useState } from "react";
import { InputWrapper } from "../styles";
import type { IInputProps } from "../../../types/IInputProps";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function AppInput({label, min, max, disabled, placeholder, required, titleCase, cpf }: IInputProps) {
    const [value, setValue] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        if (titleCase && !cpf) {
            inputValue = toTitleCase(inputValue);
        }
        if (cpf) {
            inputValue = inputValue.replace(/\D/g, "");
            if(inputValue.length === 12) {
                return;
            }
            if(inputValue.length > 3) {
               inputValue =  inputValue.replace(/^(\d{3})(\d)/, "$1.$2")
            }
            if(inputValue.length > 6) {
               inputValue =  inputValue.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            }
            if(inputValue.length > 9) {
               inputValue =  inputValue.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
            }
        }
        setValue(inputValue);
    };

    return(
        <InputWrapper>
            <label>{label}
            {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input className="bg-amber-300" 
            min={min} max={cpf ? 14 : max} disabled={disabled}
            placeholder={placeholder} required={required}
            value={value} onChange={handleChange}>
            </input>
        </InputWrapper>
    );
}

export default AppInput;