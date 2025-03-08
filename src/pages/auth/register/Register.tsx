import React from 'react'
import MainLayout from '@/templates/MainLayout'
import  Register_form  from '@/components/forms/Register_form'

const Register = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-md m-2"
       >
        <Register_form />
      </div>
    </MainLayout>
  )
}

export default Register