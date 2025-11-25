import { useState } from "react";
import type { IInputProps } from "../../../types/interfaces/IInputProps";
import { InputWrapper } from "../styles";

function AppDateInput({ label, required }: IInputProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        setError("");
    };

    const handleBlur = () => {
        if (required && !value) {
            setError("Data obrigatória.");
        }
    };

    return (
        <InputWrapper>
            <label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                className={`bg-amber-200 ${error ? "border border-red-500" : ""}`}
                type="date"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </InputWrapper>
    );
}

export default AppDateInput;
