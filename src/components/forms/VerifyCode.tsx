
import { useState } from 'react';
import { apiService } from '@/service/apiservice';
import { Button } from '../ui';
import { getEmail } from '@/storage/session';
import { useNavigate } from 'react-router-dom';
import {mesageResponse } from '@/components/interface/iresponse';
import { IApiResponse } from '@/components/interface/iresponse';

const VerifyCode = () => {

    const [email,] = useState(getEmail());
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const navigate = useNavigate();

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; 
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value !== '' && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        if (/^\d{6}$/.test(pastedData)) {
            setCode(pastedData.split(''));
        }
    };

    const submitCode = async () => {
        const verificationCode = code.join('');
        await apiService.get(`verify/email/${email}/${verificationCode }`).then((res: IApiResponse) =>{
            console.log(res);
            if (res.success ) {
                navigate('/auth');
            }
        }).catch (error => {
            console.log(error);
        }).finally(() => {
            console.log("Verificación completada");
        });

    };

    return (
        <div className="">
            <div className="w-full shadow-xl rounded-lg p-6 bg-opacity-90 backdrop-blur-md text-center inset-shadow-sm inset-shadow-slate-800 ">
                <h2 className="text_general text-2xl font-bold mb-4">Verifica tu Código</h2>
                <p className="text-slate-100 text_special text-xl mb-6">Introduce el código de 6 dígitos enviado a tu correo {email}.</p>
            
                <div className="flex justify-center text_especial gap-2 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onPaste={handlePaste} 
                            className="w-12 h-12 text-black text-center text-2xl font-bold bg-gray-100 border border-gray-600 rounded-lg inset-shadow-sm inset-shadow-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    ))}
                </div>

                <Button onClick={submitCode} className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg transition-all">
                    Verificar
                </Button>
            </div>
        </div>
    );
};

export default VerifyCode;
