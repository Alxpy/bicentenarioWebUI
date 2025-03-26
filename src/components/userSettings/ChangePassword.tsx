import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'

export const ChangePassword = () => {


  return (
    <div className='w-[100%] h-[100%]'>
        <div className='min-w-[100%] min-h-[100%]'>
            <Label>Password</Label>
            <Input type='password' placeholder='Password'/>
            <Button>Change Password</Button>
        </div>
    </div>
  )
}
