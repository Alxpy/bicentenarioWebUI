import { useAtom } from 'jotai';
import { emailAtom, userAdminEditAtom } from '@/context/context';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import SelectGen from "./SelectGen";
import registerController from "@/controller/auth/registerController";
import { toast } from "sonner"
import { saveEmail } from "@/storage/session";
import { apiService } from '@/service/apiservice';
import { PublicRoutes } from '@/routes/routes';
import useLocalStorage from '@/hooks/useLocalStorage';
import { AArrowDown } from 'lucide-react';
interface RegisterProps {
    type_register: string;
}

const RegisterForm = ({ type_register }: RegisterProps) => {
    const [userToEdit,setUserEdit] = useLocalStorage<{
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
    }>('user', null);
    const [, setEmail] = useAtom(emailAtom);
    const navigate = useNavigate();

    console.log(userToEdit, type_register);
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

    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [responseType, setResponseType] = useState<boolean>();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (type_register == "edit" && userToEdit) {
            setFormData({
                nombre: userToEdit.nombre || "",
                apellidoPaterno: userToEdit.apellidoPaterno || "",
                apellidoMaterno: userToEdit.apellidoMaterno || "",
                correo: userToEdit.correo || "",
                contrasena: "",
                confirmarContrasena: "",
                genero: userToEdit.genero || "",
                telefono: userToEdit.telefono || "",
                pais: userToEdit.pais || "",
                ciudad: userToEdit.ciudad || ""
            });
        }
    }, []);

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
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{8,15}$/;

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "contrasena" && key !== "confirmarContrasena" && !value.trim()) {
                newErrors[key] = "Campo obligatorio";
            }
        });

        if (formData.correo && !emailRegex.test(formData.correo)) {
            newErrors.correo = "Correo inválido";
        }

        if (formData.telefono && !phoneRegex.test(formData.telefono)) {
            newErrors.telefono = "Teléfono inválido (8-15 dígitos)";
        }

        // Solo validar contraseña si es creación o si se está cambiando
        if (type_register === "create") {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            
            if (formData.contrasena && !passwordRegex.test(formData.contrasena)) {
                newErrors.contrasena = "Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo";
            }

            if (formData.contrasena !== formData.confirmarContrasena) {
                newErrors.confirmarContrasena = "Las contraseñas no coinciden";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Resto del código sigue igual...
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
        if (validateForm()) {
            if (type_register === "create") {
                const { message, type_message } = await registerController.register(formData);
                setResponseMessage(message);
                setResponseType(type_message);

                if (type_message) {
                    toast(message); 
                    setEmail(formData.correo);
                    saveEmail(formData.correo);
                    navigate(`${PublicRoutes.VERIFY}`);
                } else {
                    toast("Error al crear la cuenta");
                }
            } else {
                // Lógica para actualizar usuario
                const editUser = {
                  nombre: formData.nombre,  
                  apellidoPaterno: formData.apellidoPaterno,
                  apellidoMaterno:  formData.apellidoMaterno, 
                  correo: formData.correo, 
                  genero: formData.genero,
                  telefono: formData.telefono,
                  pais: formData.pais,
                  ciudad: formData.ciudad,
                }
                await apiService.put(`user/${userToEdit?.id}`,editUser).then( async (response) => {
                    console.log(response);  
                    await apiService.get(`user/${userToEdit?.id}`).then((response) => {	
                        const data : any = response.data;
                        setUserEdit(data);

                    })
                });
                toast.success("Usuario actualizado correctamente");
                // Aquí iría la llamada al controlador de actualización
            }
        }
    };

    // Resto del JSX sigue igual...
    return (
        <div className="w-full">
            {/* Mensaje de respuesta */}
            {responseMessage && (
                <div className={`mb-4 p-3 rounded-lg border flex items-center ${
                    responseType 
                        ? "bg-emerald-900/50 text-emerald-100 border-emerald-500/50" 
                        : "bg-red-900/50 text-red-100 border-red-500/50"
                } backdrop-blur-sm`}>
                    {responseType ? (
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span>{responseMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {inputForm.map(({ id, label, type }) => (
                        <div key={id} className="space-y-2">
                            <label htmlFor={id} className="block text-sm font-medium text-gray-300">
                                {label}
                            </label>
                            <div className="relative">
                                {id === "genero" ? (
                                    <SelectGen
                                        value={ formData.genero || userToEdit?.genero || "" }
                                        onChange={(value) => setFormData({ ...formData, genero: value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    />
                                ) : (
                                    <div className="relative">
                                        <input
                                            id={id}
                                            type={type}
                                            value={formData[id as keyof typeof formData]}
                                            onChange={handleChange}
                                            placeholder={label}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                            disabled={id === "correo" && type_register === "edit"} // Deshabilitar correo en edición
                                        />
                                        {(id === "contrasena" || id === "confirmarContrasena") && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-3 flex items-center text-cyan-400 hover:text-cyan-300 transition"
                                            >
                                                {showPassword ? (
                                                    <FaRegEye className="w-5 h-5" />
                                                ) : (
                                                    <FaRegEyeSlash className="w-5 h-5" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {id === "contrasena" && formData.contrasena && (
                                <div className="mt-2">
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                passwordStrength === "Débil" ? "bg-red-500" :
                                                passwordStrength === "Aceptable" ? "bg-orange-500" :
                                                passwordStrength === "Buena" ? "bg-blue-500" : "bg-green-500"
                                            }`}
                                            style={{
                                                width: 
                                                    passwordStrength === "Débil" ? "30%" :
                                                    passwordStrength === "Aceptable" ? "60%" :
                                                    passwordStrength === "Buena" ? "80%" : "100%"
                                            }}
                                        ></div>
                                    </div>
                                    <p className={`text-xs mt-1 font-medium ${
                                        passwordStrength === "Débil" ? "text-red-400" :
                                        passwordStrength === "Aceptable" ? "text-orange-400" :
                                        passwordStrength === "Buena" ? "text-blue-400" : "text-green-400"
                                    }`}>
                                        Fortaleza: {passwordStrength}
                                    </p>
                                </div>
                            )}
                            
                            {errors[id] && (
                                <p className="text-red-400 text-xs mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors[id]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className={`w-full py-3 px-6 text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg flex items-center justify-center group ${
                            type_register == "create" 
                                ? "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:shadow-cyan-500/30" 
                                : "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-orange-500/30"
                        }`}
                    >
                        <span className="mr-2">
                            {type_register == "create" ? "Registrarse" : "Actualizar"}
                        </span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;