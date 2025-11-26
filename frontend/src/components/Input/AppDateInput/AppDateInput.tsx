import type { IInputProps } from "../../../types/interfaces/IInputProps";
import { InputWrapper } from "../styles";

interface AppDateInputProps extends IInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function AppDateInput({ label, required, value, onChange, error }: AppDateInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value); 
    };

    return (
        <InputWrapper>
            <label className="block mb-1 font-semibold text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                className={`bg-white border border-black rounded p-2 w-full ${error ? "border-red-500" : ""}`}
                type="date"
                value={value}
                onChange={handleChange}
                required={required}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </InputWrapper>
    );
}

export default AppDateInput;