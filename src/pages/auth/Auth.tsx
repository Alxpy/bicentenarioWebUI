import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/templates/MainLayout";
import { Login, Register } from "./index";
import salarWallper from "@/assets/wallpers/salar-min.jpg";
import puertaWallper from "@/assets/wallpers/tiwapurta-min.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <MainLayout>
      {/* Contenedor de fondo con animación */}
      <div className="w-[100vw] h-full flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "puerta" : "salar"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5}}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${isLogin ? puertaWallper : salarWallper})`,
            }}
          />
        </AnimatePresence>

        <div className="contenedorForm w-full sm:w-[80%] md:w-[60%] lg:w-[50vw] relative flex flex-col items-center z-10">
        
          <div className="w-full flex lg:hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-3 text-center ${
                isLogin ? "text-white" : "bg-slate-500 text-slate-50"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-3 text-center ${
                !isLogin ? "text-white" : "bg-slate-500 text-slate-50"
              }`}
            >
              Registrarse
            </button>
          </div>

          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1.5 }}
            className="w-full shadow-xl rounded-lg p-6 bg-opacity-20 backdrop-blur-sm"
          >
            {isLogin ? <Login /> : <Register />}
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="hidden lg:flex absolute right-[-1rem] top-1/2 transform -translate-y-1/2"
          >
            <button
              onClick={handleToggle}
              className="bg-slate-600 text-white px-6 py-3 rounded-l-lg shadow-lg hover:bg-blue-900 transition-all rotate-90 origin-right"
            >
              {isLogin ? "Registrarse" : "Iniciar Sesión"}
            </button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;
