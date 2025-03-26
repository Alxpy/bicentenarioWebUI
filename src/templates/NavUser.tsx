import React, { useState, useEffect } from 'react';
import { getUser } from "@/storage/session";
import { useAtom } from 'jotai';
import { openUserSettingsAtom } from '@/context/context';
import { Menu } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import UserSettings from "@/components/userSettings/UserSettings";

const NavUser = () => {
    const [open, setOpen] = useAtom(openUserSettingsAtom);
    const [selectValue, setSelectValue] = useState<string>("");

    const menuItems = [
        { value: "settings", label: "⚙️ Configuraciones", className: "hover:bg-gray-700 text-gray-300" },
        { value: "logout", label: "🚪 Cerrar sesión", className: "hover:bg-red-600 text-red-300" }
    ];

    useEffect(() => {
        if (open) {
            setSelectValue(""); // Reinicia el valor cuando el modal está abierto
        }
    }, [open]);

    const handleSelect = (value: string) => {
        setSelectValue(""); // Resetea el valor después de seleccionar
        if (value === "settings") {
            setOpen(true);
        }
        if (value === "logout") {
            console.log("Cerrando sesión...");
            // Aquí puedes manejar el cierre de sesión
        }
    };

    return (
        <>
            <div className="flex items-center gap-3 relative">
                {/* Nombre de Usuario */}
                <span className="text-lg font-medium">{getUser().nombre}</span>

                {/* Botón de hamburguesa con menú */}
                <Select value={selectValue} onValueChange={handleSelect}>
                    <SelectTrigger className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 shadow-md">
                        <Menu size={24} color={'white'} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border border-gray-600 text-gray-200 rounded-lg shadow-lg w-48">
                        {menuItems.map((item) => (
                            <SelectItem key={item.value} value={item.value} className={`cursor-pointer px-4 py-2 ${item.className}`}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <UserSettings />
        </>
    );
};

export default NavUser;
