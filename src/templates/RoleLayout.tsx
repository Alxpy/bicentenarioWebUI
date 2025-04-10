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
    role?: string; 
}

export const RoleLayout = ({ children, role = 'user' }: MainLayoutProps) => {
    const location = useLocation();
    
    return (
        <BodyContainer >
            <Navbar />
            <SidebarProvider>
                   
                    <div className="flex flex-1 overflow-hidden bg-slate-100" >
                        
                        <AppSidebar role={role} />
                        
                        <motion.main
                            key={location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 overflow-y-auto p-4"
                        >
                            <SidebarTrigger className="md:hidden mb-4" />
                            <div className="w-[100%]">
                            
                            {children}
                            </div>
                        </motion.main>
                    </div>
            </SidebarProvider>

            <Toaster />
        </BodyContainer>
    )
}