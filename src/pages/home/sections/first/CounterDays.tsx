import React, { useEffect, useState } from 'react';

const CounterDays = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const targetDate = new Date('2025-08-06'); 
    const currentDate = new Date(); 

    const difference = targetDate.getTime() - currentDate.getTime();

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    setDaysLeft(days);
  }, []);

  return (
    <div className='text-white w-full z-1 mt-20 text-3xl sm:text-4xl md:text-5xl flex flex-row items-center justify-center space-x-6 p-5 z-2'>
      <h2>Faltan {daysLeft} días hasta el 6 de agosto.</h2>
    </div>
  );
};

export default CounterDays;
