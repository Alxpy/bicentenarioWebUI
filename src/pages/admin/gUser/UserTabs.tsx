import { GenericTabs } from "@/components/GenericTabs";
import { KeyIcon, UserIcon } from "lucide-react";
import  RegisterForm  from '@/components/forms/Register_form'
import { ChangePassword } from '@/components/userSettings/ChangePassword'
export const UserSettingsTabs = () => {
  const tabs = [
    {
      value: "account",
      label: "Perfil",
      icon: <UserIcon className="w-5 h-5" />,
      content: <RegisterForm
        type_register="edit"
        // user={user} // Puedes pasar el usuario aquí si es necesario
      />,
      activeGradient: {
        from: "cyan-500/20",
        to: "blue-500/20"
      }
    },
    {
      value: "password",
      label: "Contraseña",
      icon: <KeyIcon className="w-5 h-5" />,
      content: <ChangePassword/>,
      activeGradient: {
        from: "emerald-500/20",
        to: "teal-500/20"
      }
    }
  ];

  return (
    <GenericTabs 
      defaultTab="account" 
      tabs={tabs}
      stickyHeader={true}
      className="bg-gray-900 rounded-lg p-4"
    />
  );
};