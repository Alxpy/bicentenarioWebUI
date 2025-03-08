import { useState } from "react";
import { Button } from "../ui";
import { Input } from "../ui";
import { Label } from "../ui";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
        genero: "",
        telefono: "",
        pais: "",
        ciudad: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            alert("Registro exitoso");
        }
    };

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-2xl shadow-2xl rounded-3xl p-10 border border-gray-200"
                style={{
                        background: "rgba(149, 149, 149, 0.1)",
                      }}
            >
                <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Crear Cuenta</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {[ 
                            { id: "nombre", label: "Nombre", type: "text" },
                            { id: "apellidoPaterno", label: "Apellido Paterno", type: "text" },
                            { id: "apellidoMaterno", label: "Apellido Materno", type: "text" },
                            { id: "correo", label: "Correo", type: "email" },
                            { id: "contrasena", label: "Contraseña", type: "password" },
                            { id: "genero", label: "Género", type: "text" },
                            { id: "telefono", label: "Teléfono", type: "text" },
                            { id: "pais", label: "País", type: "text" },
                            { id: "ciudad", label: "Ciudad", type: "text" }
                        ].map(({ id, label, type }) => (
                            <div key={id} className="flex flex-col">
                                <Label htmlFor={id} className="text-gray-700 font-semibold mb-1">{label}</Label>
                                <Input
                                    id={id}
                                    type={type}
                                    value={formData[id as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={label}
                                    className="w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                                {errors[id] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                    >
                        Registrarse
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
