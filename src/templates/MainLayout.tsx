import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner"
import BodyContainer from '../styles/BodyStyle';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <BodyContainer className="flex flex-col bg-slate-600">
            <Navbar/>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                    {children}
                </main>
                
            </div>
            <Toaster />
            <Footer />
        </BodyContainer>
    );
};

export default MainLayout;