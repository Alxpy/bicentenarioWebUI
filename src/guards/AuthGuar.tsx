import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "@/routes/routes";
import { useEffect, useState } from "react";
import { apiService } from "@/service/apiservice";
import { getLoginSession } from "@/storage/session";

export const AuthGuard = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = getLoginSession();
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await apiService.get(`validate`, {        
            token: token,
            required_roles: 'Usuario'          
        });
        console.log(response);
        setIsValid(response.valid);
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isValid ? <Outlet /> : <Navigate replace to={PublicRoutes.AUTH} />;
};