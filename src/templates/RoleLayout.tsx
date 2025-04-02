import { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner"
import BodyContainer from '../styles/BodyStyle';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom';


interface MainLayoutProps {
    children: ReactNode;
    role?: string; // Añadir prop para el rol
}

export const RoleLayout = ({ children, role = 'user' }: MainLayoutProps) => {
    const location = useLocation();
    
    return (
        <BodyContainer className="flex flex-col min-h-screen bg-blue-50">
            <SidebarProvider>
                <div className="flex flex-col h-screen">
                    {/* Navbar en la parte superior */}
                    <Navbar />
                    
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar lateral */}
                        <AppSidebar role={role} />
                        
                        {/* Contenido principal con animación */}
                        <motion.main
                            key={location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 overflow-y-auto p-4"
                        >
                            <SidebarTrigger className="md:hidden mb-4" />
                            {children}
                        </motion.main>
                    </div>
                </div>
            </SidebarProvider>

            <Toaster />
        </BodyContainer>
    )
}