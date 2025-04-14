import { useState, useEffect } from 'react';
import { getUser, removeLoginSession } from "@/storage/session";
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
import {NavAdm}  from './NavAdm';

const NavUser = () => {
    const [open, setOpen] = useAtom(openUserSettingsAtom);
    const [selectValue, setSelectValue] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);

    // Verificar roles al montar el componente
    useEffect(() => {
        const user = getUser();
        setIsAdmin(user?.roles?.includes('Administrador') || false);
    }, []);

    const menuItems = [
        { value: "settings", label: "⚙️ Configuraciones", className: "hover:bg-gray-700 text-gray-300" },
        ...(isAdmin ? [{ value: "admin", label: "👑 Administración", className: "hover:bg-purple-600 text-purple-300" }] : []),
        { value: "logout", label: "🚪 Cerrar sesión", className: "hover:bg-red-600 text-red-300" }
    ];

    useEffect(() => {
        if (open) {
            setSelectValue(""); // Reinicia el valor cuando el modal está abierto
        }
    }, [open]);

    const handleSelect = (value: string) => {
        setSelectValue(""); // Resetea el valor después de seleccionar
        switch(value) {
            case "settings":
                setOpen(true);
                break;
            case "admin":
                // No necesitas hacer nada aquí si NavAdm se muestra condicionalmente
                break;
            case "logout":
                removeLoginSession();
                window.location.reload();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="flex items-center gap-3 relative">
                {/* Nombre de Usuario */}
                <span className="text-lg font-medium">{getUser().nombre}</span>

                {/* Mostrar NavAdm como elemento separado si es admin */}
                {isAdmin && (
                    <div className="hidden md:block ml-2">
                        <NavAdm />
                    </div>
                )}
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

            {/* Modal de configuración de usuario */}
            <UserSettings />
        </>
    );
};

export default NavUser;