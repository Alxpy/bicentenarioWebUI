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
    <div>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      <div className="mb-4">
        <Label htmlFor="email" className="text-slate-900 text-lg font-semibold mb-1">Correo</Label>
        <Input
          id="email"
          type="email"
          placeholder="Ingresa tu correo"
          value={user_login.email}
          onChange={(e) => setUser_login({ ...user_login, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div className="relative mb-4">
        <Label htmlFor="password" className="text-slate-900 text-lg font-semibold mb-1">Contraseña</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={user_login.password}
          onChange={(e) => setUser_login({ ...user_login, password: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-4 right-3 flex items-center text-gray-500"
        >
          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>
      </div>

      <div className="mb-4">
        <ReCAPTCHA sitekey={captcha_key} onChange={handleCaptcha} />
      </div>

      <Button onClick={handleLogin} className="bg-slate-500 text-white w-full hover:bg-slate-600">
        Entrar
      </Button>
    </div>
  );
};

export default Login_form;
