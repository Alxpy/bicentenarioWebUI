import React from 'react'
import { apiService } from '@/service/apiservice'
import { Button, Label, Input } from '../ui'

import { toast } from 'sonner'

interface SendCodeProps {
    email: string;
    setEmail: (email: string) => void;
    setStep: (step: 'email' | 'code' | 'newPassword') => void;
}


export const SendReco = ({ email, setEmail, setStep }: SendCodeProps) => {
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
    const sendRecoveryEmail = async () => {
        try {
            const response = await apiService.get(`send_email/recovery_password/${email}`)
            console.log(response)
            if (response.success) {
                toast.success(response.message)
                setStep('code')
            }
        } catch (error) {
            toast.error('Error al enviar el correo de recuperación')
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
                type="email"
                id="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
            />
            <Button onClick={sendRecoveryEmail}>Enviar</Button>
        </div>
    )
}
