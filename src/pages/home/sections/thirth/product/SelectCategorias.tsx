import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const categorias = [
  { value: "artesanias", label: "Artesanías Bolivianas" },
  { value: "gastronomia", label: "Gastronomía Típica" },
  { value: "ropa_tradicional", label: "Ropa Tradicional" },
  { value: "souvenirs", label: "Souvenirs del Bicentenario" },
  { value: "productos_naturales", label: "Productos Naturales" },
]

const SelectCategorias = () => {
  const [value, setValue] = useState<string>("")

  return (
    <Select onValueChange={setValue}>
      <SelectTrigger className="w-[220px] border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 rounded-lg shadow-md">
        <SelectValue placeholder="Selecciona una categoría" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg shadow-lg">
        {categorias.map((categoria) => (
          <SelectItem
            key={categoria.value}
            value={categoria.value}
            className="cursor-pointer hover:bg-slate-700 text-slate-300"
          >
            {categoria.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectCategorias
