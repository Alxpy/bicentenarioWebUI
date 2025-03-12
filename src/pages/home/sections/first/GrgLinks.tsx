import React from 'react';

const GrgLinks = () => {
  return (
    <div className="text-white w-full z-1 mt-20 shadow-lg"
      style={{ background: 'rgba(37, 99, 235, 0.2)' }}>
      <div className='text-xl flex flex-wrap items-center justify-center sm:justify-around space-x-6 p-5 z-2'>
        <h2 className="hover:text-blue-400 cursor-pointer text-center sm:text-left w-full sm:w-auto">Archivo</h2>
        <h2 className="hover:text-blue-400 cursor-pointer text-center sm:text-left w-full sm:w-auto">Turismo</h2>
        <h2 className="hover:text-blue-400 cursor-pointer text-center sm:text-left w-full sm:w-auto">Eventos</h2>
        <h2 className="hover:text-blue-400 cursor-pointer text-center sm:text-left w-full sm:w-auto">Emprendimientos</h2>
        <h2 className="hover:text-blue-400 cursor-pointer text-center sm:text-left w-full sm:w-auto">Tienda</h2>
      </div>
    </div>
  );
};

export default GrgLinks;
