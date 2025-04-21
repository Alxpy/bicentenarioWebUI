import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"
import { SendReco } from './SendReco'
import VerifyCode from './VerifyCode'
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
            <DialogTrigger className="text-sm text-cyan-400 hover:text-cyan-300 transition inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                ¿Olvidaste tu contraseña?
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