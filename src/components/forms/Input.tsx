import React from 'react'
import { ErrorMessage, Field } from 'formik'
import { cn } from '@/lib/utils'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'primary' | 'secondary'
}


export const Input = ({ className,variant='primary' ,name="", ...props }:Props) => {
  return (
    <div>
      <Field        
        className={cn('bg-green-200', 
          variant === 'primary' && 'bg-red-100 focus:border-blue-500',
          variant === 'secondary' && 'border-gray-300 focus:border-red-500',
          className)}
        name={name}
        {
            ...props
        }
      />
      <ErrorMessage name={name}>
          {(msg) => (
              <div className="text-red-500 text-sm">
                  {msg}
              </div>
          )}
      </ErrorMessage>
      
    </div>
  )
}
