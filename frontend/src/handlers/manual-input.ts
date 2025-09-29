interface ManualInput {
  inputValue: string;
  setDisplayValue: (value: string) => void;
  setInternalValue: (value: string) => void;
  onChange: (value: string) => void;
}

export const handleManualInput = ({
  inputValue,
  setDisplayValue,
  setInternalValue,
  onChange,
}: ManualInput) => {
  const numbers = inputValue.replace(/\D/g, "");

  let formatted = "";
  if (numbers.length >= 1) {
    formatted = numbers.slice(0, 2);
  }
  if (numbers.length >= 3) {
    formatted += "/" + numbers.slice(2, 4);
  }
  if (numbers.length >= 5) {
    formatted += "/" + numbers.slice(4, 8);
  }

  setDisplayValue(formatted);

  if (numbers.length === 8) {
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);
    const isoDate = `${year}-${month}-${day}`;
    setInternalValue(isoDate);
    onChange(isoDate);
  }
};
