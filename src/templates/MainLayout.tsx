import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner"


interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="bg-blue-100  flex flex-col w-min-[100vw]">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Toaster />
            <Footer />
        </div>
    );
};

export default MainLayout;