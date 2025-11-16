import { useState } from "react";
import type { IInputProps } from "../../../types/IInputProps";
import { InputWrapper } from "../styles";

function AppNumInput({label, min, max}:IInputProps){
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
            inputValue = inputValue.replace(/\D/g, "");

            if(Number(inputValue) && (min && Number(inputValue) < min)) {
                setError(`O valor mínimo é ${min}`);
                setValue(inputValue);
                return;
            }

            if(Number(inputValue) && (max && Number(inputValue) > max)) {
                setError(`O valor máximo é ${max}`);
                setValue(inputValue);
                return;
            }
            setError("");
            setValue(inputValue);
        };

    return(
    <InputWrapper>
        <label>{label}</label>
        <input className="bg-amber-400"
        onChange={handleChange} value={value}></input>
        <p className="text-red-700">{error}</p>
    </InputWrapper>)

}

export default AppNumInput;