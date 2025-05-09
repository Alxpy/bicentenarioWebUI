import { useState } from 'react';
import { apiService } from '@/service/apiservice';
import { Button } from '../ui';
import { getEmail } from '@/storage/session';
import { useNavigate } from 'react-router-dom';
import { IApiResponse } from '@/components/interface/iresponse';

const VerifyCode = () => {
    const [email,] = useState(getEmail());
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Solo permite números
        if (value.length > 1) return;
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError('');

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
            setError('');
        }
    };

    const submitCode = async () => {
        if (code.some(digit => digit === '')) {
            setError('Por favor completa todos los dígitos');
            return;
        }

        setIsLoading(true);
        const verificationCode = code.join('');
        
        try {
            const res: IApiResponse = await apiService.get(`auth/login/verifyCode/${email}/${verificationCode}`);
            if (res.success) {
                navigate('/auth');
            } else {
                setError(res.message || 'Código inválido. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error(error);
            setError('Ocurrió un error al verificar el código');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center  bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        Verifica tu Código
                    </h2>
                    <p className="text-gray-300">
                        Introduce el código de 6 dígitos enviado a <span className="font-medium text-cyan-300">{email}</span>
                    </p>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="mb-6 p-3 bg-red-900/50 text-red-100 rounded-lg border border-red-500/50 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Campos de código */}
                <div className="flex justify-center gap-3 mb-8">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onPaste={handlePaste}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && digit === '' && index > 0) {
                                    const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
                                    if (prevInput) prevInput.focus();
                                }
                            }}
                            className="w-14 h-14 text-center text-3xl font-bold bg-white/5 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {/* Botón de verificación */}
                <Button 
                    onClick={submitCode}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center group ${
                        isLoading ? 'bg-gray-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 hover:shadow-cyan-500/30'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificando...
                        </>
                    ) : (
                        <>
                            <span className="mr-2">Verificar Código</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </>
                    )}
                </Button>

                {/* Enlace de reenvío */}
                <div className="mt-6 text-center">
                    <button 
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition inline-flex items-center"
                        onClick={() => console.log('Reenviar código')}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        ¿No recibiste el código? Reenviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;