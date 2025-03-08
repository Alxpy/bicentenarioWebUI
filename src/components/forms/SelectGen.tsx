import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  interface SelectGenProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  const SelectGen = ({ value, onChange }: SelectGenProps) => {
    const options = [
      { value: "M", label: "Masculino" },
      { value: "F", label: "Femenino" },
      { value: "O", label: "Otro" }
    ];
  
    return (
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full text-sm border border-gray-300 bg-gray-50 text-gray-900 inset-shadow-sm inset-shadow-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <SelectValue placeholder="Selecciona tu género">
            {options.find((option) => option.value === value)?.label || "Selecciona"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  export default SelectGen;
