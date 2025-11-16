import { useState, useRef, useEffect } from "react";
import type { IDropDownProps } from "../../types/IDropDownProps";

function AppDropdown({ label, options, onChange }: IDropDownProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function selectValue(value: string): void {
    setSelectedValue(value);
    setOpen(false);
    if (onChange) {
      onChange(value);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const threshold = 200; 

      setOpenUpward(spaceBelow < threshold);
    }
  }, [open]);

  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || label;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {selectedLabel}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute w-44 rounded-md shadow-lg bg-white border border-gray-300 z-50 ${
            openUpward ? "bottom-full mb-2" : "mt-2"
          } ml-[10px]`}
        >
          <div className="py-1">
            {options.map((el) => (
              <a
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                key={el.value}
                onClick={() => selectValue(el.value)}
              >
                {el.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppDropdown;
