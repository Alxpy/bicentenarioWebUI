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
  className?: string;
}

const SelectGen = ({ value, onChange, className }: SelectGenProps) => {
  const options = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
    { value: "O", label: "Otro" }
  ];

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger 
        className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition ${className}`}
      >
        <SelectValue placeholder="Selecciona tu género">
          <span className="text-white">
            {options.find((option) => option.value === value)?.label || "Selecciona género"}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border border-white/20 backdrop-blur-lg">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="focus:bg-cyan-500/10 focus:text-cyan-400"
          >
            <div className="flex items-center">
              {option.value === "M" && (
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {option.value === "F" && (
                <svg className="w-4 h-4 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              {option.value === "O" && (
                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              )}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectGen;