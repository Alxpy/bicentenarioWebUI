import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/templates/MainLayout";
import salarWallper from "@/assets/wallpers/salar-min.jpg";
import puertaWallper from "@/assets/wallpers/tiwapurta-min.jpg";
import Login_form from "@/components/forms/Login_form";
import Register_form from "@/components/forms/Register_form";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <MainLayout>
      <div className="w-[100vw] min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "puerta" : "salar"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${isLogin ? puertaWallper : salarWallper})`,
            }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </AnimatePresence>

        <div className="contenedorForm w-full sm:w-[80%] md:w-[60%] lg:w-[50vw] xl:w-[40vw] relative flex flex-col items-center z-10 p-4">
        
          <div className="w-full flex lg:hidden mb-6 bg-white/10 rounded-lg overflow-hidden backdrop-blur-sm border border-white/20">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-3 text-center transition-all ${
                isLogin 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-3 text-center transition-all ${
                !isLogin 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Registrarse
            </button>
          </div>

          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full shadow-2xl rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/20"
          >
            <div className={`p-6 ${isLogin ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20" : "bg-gradient-to-r from-emerald-500/20 to-teal-600/20"}`}>
              <h2 className="text-2xl font-bold text-white text-center">
                {isLogin ? "Inicia Sesión" : "Crea tu Cuenta"}
              </h2>
              <p className="text-center text-gray-300 mt-1">
                {isLogin ? "Ingresa tus credenciales" : "Completa el formulario"}
              </p>
            </div>

            <div className="p-6">
              {isLogin ? <Login_form /> : <Register_form type_register="create" />}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex absolute right-[-3rem] top-1/2 transform -translate-y-1/2"
          >
            <button
              onClick={handleToggle}
              className={`px-6 py-3 rounded-l-lg shadow-lg transition-all rotate-90 origin-right font-medium ${
                isLogin 
                  ? "bg-gradient-to-b from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30" 
                  : "bg-gradient-to-b from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/30"
              }`}
            >
              {isLogin ? "Registrarse →" : "← Iniciar Sesión"}
            </button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;