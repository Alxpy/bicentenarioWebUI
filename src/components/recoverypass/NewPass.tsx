import{ useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"
import { SendReco } from './SendReco'
import  VerifyCode  from './VerifyCode'
import { Pass_form } from '@/components/forms/Pass_form'

type Step = 'email' | 'code' | 'newPassword'

export const PasswordRecoveryDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
  
  


    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <SendReco email={email} setEmail={setEmail} setStep={setStep} />
                )
            case 'code':
                return (
                   <VerifyCode email={email} setStep={setStep} />
                )
            case 'newPassword':
                return (
                    <Pass_form email={email} setIsOpen={setIsOpen} />
                )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="text-blue-700 hover:text-blue-900">                
                    Recuperar Contraseña
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Recuperar contraseña</DialogTitle>
                    <DialogDescription>
                        {step === 'email' && 'Ingresa tu correo electrónico para recuperar tu contraseña'}
                        {step === 'code' && 'Verifica el código enviado a tu correo electrónico'}
                        {step === 'newPassword' && 'Crea una nueva contraseña para tu cuenta'}
                    </DialogDescription>
                </DialogHeader>
                {renderStep()}
            </DialogContent>
        </Dialog>
    )
}