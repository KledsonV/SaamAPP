import { handleManualInput } from "@/handlers/manual-input";
import { convertBRDateToISO, convertISODateToBR, formatDateExtended } from "@/utils/relatorios-utils";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export const DateInput = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon = Calendar,
  error = false,
  helperText = "",
}) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [internalValue, setInternalValue] = useState("");

  useEffect(() => {
    if (value) {
      if (value.includes("-")) {
        setDisplayValue(convertISODateToBR(value));
        setInternalValue(value);
      } else {
        setDisplayValue(value);
        setInternalValue(convertBRDateToISO(value));
      }
    } else {
      setDisplayValue("");
      setInternalValue("");
    }
  }, [value]);

  const handleInputChange = (inputValue: string) => {
    setInternalValue(inputValue);
    const brDate = convertISODateToBR(inputValue);
    setDisplayValue(brDate);
    onChange(inputValue);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
        {label}
      </label>
      <div className="relative">
        <div
          className={`
          absolute left-3 top-1/2 transform -translate-y-1/2 z-10
          ${focused ? "text-blue-600" : "text-gray-400"}
          transition-colors duration-200
        `}
        >
          <Icon className="w-5 h-5" />
        </div>

        <input
          type="date"
          value={internalValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
        />

        <input
          type="text"
          value={displayValue}
          onChange={(e) =>
            handleManualInput({
              inputValue: e.target.value,
              setDisplayValue,
              setInternalValue,
              onChange: (val) => console.log(val),
            })
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="dd/mm/aaaa"
          maxLength={10}
          className={`
            w-full pl-12 pr-20 py-3.5 rounded-xl border-2 transition-all duration-300
            bg-white shadow-sm font-medium text-gray-900
            focus:outline-none focus:ring-0 z-10
            ${
              error
                ? "border-red-300 focus:border-red-500 bg-red-50"
                : focused
                ? "border-blue-500 shadow-lg shadow-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
        />

        {displayValue && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-30">
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
              ✓
            </div>
          </div>
        )}
      </div>

      {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      {internalValue && !helperText && (
        <p className="mt-2 text-sm text-blue-600 font-medium capitalize">
          {formatDateExtended(internalValue)}
        </p>
      )}
    </div>
  );
};
