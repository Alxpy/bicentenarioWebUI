
import { useState } from 'react';
import { apiService } from '@/service/apiservice';
import { Button, Input } from '../ui';
import { toast } from 'sonner'

interface VerifyCodeProps {
    email: string;
    setStep: (step: 'email' | 'code' | 'newPassword') => void;
}

const VerifyCode = ({ email, setStep }: VerifyCodeProps) => {
    const [code, setCode] = useState(['', '', '', '', '', ''])

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return
        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value !== '' && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement
            if (nextInput) nextInput.focus()
        }
    }
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').trim()

        if (/^\d{6}$/.test(pastedData)) {
            setCode(pastedData.split(''))
        }
    }


    const verifyCode = async () => {
        const verificationCode = code.join('')
        try {
            const response = await apiService.get(`verify/email/${email}/${verificationCode}`)
            console.log(response)
            if (response.success) {
                toast.success('Código verificado correctamente')
                setStep('newPassword')
            }
        } catch (error) {
            toast.error('Código inválido')
            console.error(error)
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Ingresa el código de 6 dígitos enviado a {email}
            </p>
            <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                    <Input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        value={digit}
                        maxLength={1}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-xl"
                    />
                ))}
            </div>
            <Button className="w-full" onClick={verifyCode}>
                Verificar
            </Button>
        </div>
    );
};

export default VerifyCode;
