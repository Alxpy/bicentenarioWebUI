import { useAtom } from 'jotai';
import { emailAtom } from '@/context/context';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Button } from "../ui";
import { Input } from "../ui";
import { Label } from "../ui";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import SelectGen from "./SelectGen";
import registerController from "@/controller/auth/registerController";
import { toast } from "sonner"

import {saveEmail} from "@/storage/session";

interface RegisterProps {
    type_register: string;
}

const RegisterForm = (
    { type_register }: RegisterProps
) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
        genero: "",
        telefono: "",
        pais: "",
        ciudad: ""
    });

    const [,setEmail] = useAtom(emailAtom);

    const navigate = useNavigate();

    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [responseType, setResponseType] = useState<boolean>();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const inputForm = [
        { id: "nombre", label: "Nombre", type: "text" },
        { id: "apellidoPaterno", label: "Apellido Paterno", type: "text" },
        { id: "apellidoMaterno", label: "Apellido Materno", type: "text" },
        { id: "correo", label: "Correo", type: "email" },
        ...(type_register === "create" ? [
            { id: "contrasena", label: "Contraseña", type: showPassword ? "text" : "password" },
            { id: "confirmarContrasena", label: "Confirmar Contraseña", type: showPassword ? "text" : "password" }
        ] : []),
        { id: "genero", label: "Género", type: "text" },
        { id: "telefono", label: "Teléfono", type: "text" },
        { id: "pais", label: "País", type: "text" },
        { id: "ciudad", label: "Ciudad", type: "text" }
    ]

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{8,15}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        Object.entries(formData).forEach(([key, value]) => {
            if (!value.trim()) {
                newErrors[key] = "Campo obligatorio";
            }
        });

        if (formData.correo && !emailRegex.test(formData.correo)) {
            newErrors.correo = "Correo inválido";
        }

        if (formData.telefono && !phoneRegex.test(formData.telefono)) {
            newErrors.telefono = "Teléfono inválido (8-15 dígitos)";
        }

        if (formData.contrasena && !passwordRegex.test(formData.contrasena)) {
            newErrors.contrasena = "Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo";
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const evaluatePasswordStrength = (password: string) => {
        if (password.length < 6) return "Débil";
        if (password.length < 8) return "Aceptable";
        if (/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) return "Excelente";
        return "Buena";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        if (id === "contrasena") {
            setPasswordStrength(evaluatePasswordStrength(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        if (validateForm()) {
          const { message, type_message } = await registerController.register(formData);
      
          setResponseMessage(message);
          setResponseType(type_message);
      
          if (type_message) {
            toast(message); 
            setEmail(formData.correo);
            saveEmail(formData.correo);
            navigate("/verify");
          } else {
            toast("Error al crear la cuenta");
          }
        }
      };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            alert("Actualización exitosa");
        }
    }

    return (
        <div className="flex items-center justify-center p-6 w-[100%] ">
            <div className="h-full max-w-2xl inset-shadow-sm inset-shadow-slate-950 rounded-3xl p-6 border border-gray-200"
                style={{
                        background: "rgba(149, 149, 149, 0.4)",
                      }}
            >
                { type_register == "create" ? (
                    <h2 className="text-5xl text_general text-lime-50 text-center mb-8">Crear Cuenta</h2>
                ) : (
                    <h2 className="text-5xl text_general text-center text-lime-100 mb-8">Actualizar Cuenta</h2>
                )

                }

                <form onSubmit={
                    type_register == "create" ? handleSubmit : handleUpdate
                } className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6 sm:grid-cols-1">
                        {inputForm.map(({ id, label, type }) => (
                            <div key={id} className="flex flex-col">
                                <Label htmlFor={id} className="text-slate-900 text_general text-lg font-semibold mb-1">{label}</Label>
                                <div className="relative">
                                {id === "genero" ? (
                                        <SelectGen
                                            value={formData.genero}
                                            onChange={(value) => setFormData({ ...formData, genero: value })}
                                        />
                                    ) : (
                                        <Input
                                            id={id}
                                            type={type}
                                            value={formData[id as keyof typeof formData]}
                                            onChange={handleChange}
                                            placeholder={label}
                                            className="w-full text_special text-lg border border-gray-300 bg-gray-50 text-gray-900 inset-shadow-sm inset-shadow-slate-800 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    )}
                                    {id === "contrasena" && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}
                                        </button>
                                    )}
                                </div>
                                {id === "contrasena" && formData.contrasena && (
                                    <p className={`mt-1 text-sm font-semibold ${
                                        passwordStrength === "Débil" ? "text-red-500" :
                                        passwordStrength === "Aceptable" ? "text-orange-500" :
                                        passwordStrength === "Buena" ? "text-blue-500" : "text-green-500"
                                    }`}>
                                        Fortaleza: {passwordStrength}
                                    </p>
                                )}
                                {errors[id] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center">
                        { type_register == "create" ? (
                            <Button
                            type="submit"
                            className="w-[50%]  bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                            Registrarse
                        </Button>
                        ) :
                        (<Button
                            type="submit"
                            className="w-[50%]  bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                            Actualizar
                        </Button>
                        )

                        }
                    </div>
                </form>
                <div className="flex items-center justify-center mt-4">
                {responseMessage && (
                    <div className={`p-4 rounded-lg w-full text-center 
                    ${responseType ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {responseMessage}
                    </div>
                )}
                </div>
                                
            </div>
        </div>
    );
};

export default RegisterForm;
