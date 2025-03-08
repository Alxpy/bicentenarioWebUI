import React from 'react'
import MainLayout from '@/templates/MainLayout'
import  Register_form  from '@/components/forms/Register_form'
import salarWallper from '@/assets/wallpers/salar.jpg'



const Register = () => {
  return (
    <MainLayout>
      <div className="w-full h-full flex items-center justify-center "
      style={
        {
          backgroundImage: `url(${salarWallper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }
       >
        <Register_form type_register='create' />
      </div>
    </MainLayout>
  )
}

export default Register