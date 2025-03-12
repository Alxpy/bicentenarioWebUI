import React from 'react';
import CarrouselNews from './CarrouselNews';

const Second_section = () => {
  return (
    <section id="news" className="relative w-full h-auto sm:h-[50vh] md:h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black pt-20"> {/* Añadí pt-20 para margen superior */}
    
      <CarrouselNews />
    </section>
  );
};

export default Second_section;
