import {useState} from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { Input } from './ui/input';

interface InputPasswordProps {
    id: string;
    type: string;
    formData: Record<string, string>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const InputPassword = (
    {id, type, formData, handleChange, label}: InputPasswordProps
) => {

    const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    <Input
        id={id}
        type={type}
        value={formData[id as keyof typeof formData]}
        onChange={handleChange}
        placeholder={label}
        className="w-full text_special text-lg border border-gray-300 bg-gray-50 text-gray-900 inset-shadow-sm inset-shadow-slate-800 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
    >
        {showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}
    </button>
    </>
  )
}

export default InputPassword
