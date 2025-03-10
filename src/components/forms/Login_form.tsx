import { useState } from 'react';
import { iUser_Login } from '@/components/interface/iuser';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {apiService} from '@/service/apiservice';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import {mesageResponse } from '@/components/interface/iresponse';
import {saveLoginSession} from '@/storage/session'

const Login_form = () => {

    const [user_login, setUser_login] = useState<iUser_Login>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setError(""); 
        try {
          await apiService.create("login", user_login).then((res) => {
            console.log(res);
            const response: mesageResponse = res.response;
            if (response.success) {
               saveLoginSession(response.token);
              window.location.href = "/";
            }
            else {
              setError(response.mesage);
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
          <Label htmlFor="email" className="text-slate-900 text_general text-lg font-semibold mb-1">Correo</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu correo"
            value={user_login.email}
            onChange={(e) => setUser_login({ ...user_login, email: e.target.value })}
            className="w-full text_special text-lg border border-gray-300 bg-gray-50 text-gray-900 inset-shadow-sm inset-shadow-slate-800 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="relative mb-4">
          <Label htmlFor="password" className="text-slate-900 text_general text-lg font-semibold mb-1">
            Contraseña
          </Label>
          
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={user_login.password}
            onChange={(e) => setUser_login({ ...user_login, password: e.target.value })}
            className="w-full text_special text-lg border border-gray-300 bg-gray-50 text-gray-900 
              inset-shadow-sm inset-shadow-slate-800 rounded-lg px-4 py-2 pr-10 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {/* Botón para mostrar/ocultar contraseña */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-4 right-3 flex items-center justify-center h-full text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>


        <Button onClick={() => handleLogin()} className="bg-slate-500 text-white w-full hover:bg-slate-600">
          Entrar
        </Button>
      
    </div>
  )
}

export default Login_form
