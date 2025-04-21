import { motion } from "framer-motion";
import wallper_fondo from '@/assets/wallpers/lapaz.jpg';
import escudo from '@/assets/wallpers/escudo.png';
import letras from '@/assets/wallpers/logo_header.png';
import GrgLinks from "./GrgLinks";
import CounterDays from "./CounterDays";

const FirstSection = () => {
  return (
    <section id="inicio" className="relative w-[100vw] sm:h-[50vw] md:h-[80vw] lg:h-[80w] flex flex-col items-center justify-center bg-gradient-to-b from-black to-blue-900">
      
      <div
        className="absolute inset-0 w-full h-full blur-3xl"
        style={{
          backgroundImage: `url(${wallper_fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0px)',
          maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)'
        }}
      ></div>

      <motion.div 
        className="relative flex flex-col items-center justify-center space-y-6 px-4 sm:px-6 md:px-8 lg:px-12"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }}
      >
      
        <motion.img
          src={letras}
          alt="Letras"
          className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] h-auto m-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        />
        
        <motion.img 
          src={escudo} 
          alt="Escudo" 
          className="w-[60%] sm:w-[50%] md:w-[40%] lg:w-[35%] h-auto opacity-50 mix-blend-overlay"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      </motion.div>

      <GrgLinks />
      <CounterDays />
    </section>
  );
};

export default FirstSection;
