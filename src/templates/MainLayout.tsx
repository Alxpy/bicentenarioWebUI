import { ReactNode } from "react";
import Footer from "./footerTemplate";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner"
import BodyContainer from '../styles/BodyStyle';
import {ChatIA} from "@/components/chat/ChatIa";
interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <BodyContainer className="flex flex-col min-h-screen bg-blue-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                {children}
            </main>
            <ChatIA />
            <Footer />
            <Toaster />
        </BodyContainer>
    );
};


export default MainLayout;