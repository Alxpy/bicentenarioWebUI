import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiService } from "@/service/apiservice";
import  MainLayout  from '@/templates/MainLayout'

const Login = () => {
  const [correo, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); 
    try {
      const data = { correo, contrasena };
      const response = await apiService.create("auth/login", data);
      console.log(response);
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <div className="mb-4">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={contrasena}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button onClick={handleLogin} className="bg-blue-500 text-white w-full ">
          Entrar
        </Button>
      </div>
    </div>
      </MainLayout>
  );
};

export default Login;
