import { useState } from 'react';
import { iUser_Login } from '@/components/interface/iuser';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {apiService} from '@/service/apiservice';


const Login_form = () => {

    const [user_login, setUser_login] = useState<iUser_Login>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');

    const handleLogin = async () => {
        setError(""); 
        try {
          await apiService.create("login", user_login).then((response) => {
            console.log(response);
            if (response.status === 200) {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("user", JSON.stringify(response.data.user));
              window.location.href = "/";
            }
            else {
              setError(response);
            }
          });
          console.log(response);
        } catch (err) {
          console.error(err);
          setError("Error al iniciar sesión. Verifica tus credenciales.");
        }
      };

  return (
    <div>
        
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <div className="mb-4">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu correo"
            value={user_login.email}
            onChange={(e) => setUser_login({ ...user_login, email: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={user_login.password}
            onChange={(e) => setUser_login({ ...user_login, password: e.target.value })}
            className="mt-1"
          />
        </div>

        <Button onClick={() => handleLogin()} className="bg-slate-500 text-white w-full hover:bg-slate-600">
          Entrar
        </Button>
      
    </div>
  )
}

export default Login_form
