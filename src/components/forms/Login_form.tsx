import { useState } from 'react';
import { iUser_Login } from '@/components/interface/iuser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/service/apiservice';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IApiResponse, mesageResponse } from '@/components/interface/iresponse';
import { saveLoginSession } from '@/storage/session';
import ReCAPTCHA from 'react-google-recaptcha';
import { PasswordRecoveryDialog } from '../recoverypass/NewPass';

const Login_form = () => {
  const captcha_key = import.meta.env.VITE_RECAPTCHA_SITE_KEY; 
  const [user_login, setUser_login] = useState<iUser_Login>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleLogin = async () => {
    setError("");

    if (!captchaToken) {
      setError("Por favor, completa el reCAPTCHA.");
      return;
    }

    try {
      const payload = {
        ...user_login,
        captcha: captchaToken, 
      };

      await apiService.create("login", payload).then((response : IApiResponse) => {
        if (response.success) {
          saveLoginSession(response.data);
          window.location.href = "/";
        } else {
          setError(response.message);
        }
      });
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
<div className="w-full">
  {/* Mensaje de error */}
  {error && (
    <div className="mb-4 p-3 bg-red-900/50 text-red-100 rounded-lg border border-red-500/50 flex items-center backdrop-blur-sm">
      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  )}

  {/* Campo de email */}
  <div className="mb-6">
    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
      Correo Electrónico
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <input
        id="email"
        type="email"
        placeholder="tucorreo@ejemplo.com"
        value={user_login.email}
        onChange={(e) => setUser_login({ ...user_login, email: e.target.value })}
        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
    </div>
  </div>

  {/* Campo de contraseña */}
  <div className="mb-6">
    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
      Contraseña
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={user_login.password}
        onChange={(e) => setUser_login({ ...user_login, password: e.target.value })}
        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-cyan-400 hover:text-cyan-300 transition"
      >
        {showPassword ? (
          <FaRegEye className="w-5 h-5" />
        ) : (
          <FaRegEyeSlash className="w-5 h-5" />
        )}
      </button>
    </div>
  </div>

  {/* CAPTCHA */}
  <div className="mb-6 flex justify-center transform scale-95">
    <ReCAPTCHA 
      sitekey={captcha_key} 
      onChange={handleCaptcha}
      theme="dark"
    />
  </div>

  {/* Botón de login */}
  <button
    onClick={handleLogin}
    className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center group"
  >
    <span className="mr-2">Iniciar Sesión</span>
    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  </button>

  {/* Enlace opcional para recuperar contraseña */}
  <div className="mt-6 pt-4 border-t border-white/10 text-center">
    <PasswordRecoveryDialog />
  </div>
</div>
  );
};

export default Login_form;
