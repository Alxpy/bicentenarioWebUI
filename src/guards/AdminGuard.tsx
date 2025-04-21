import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "@/routes/routes";
import { useEffect, useState } from "react";
import { apiService } from "@/service/apiservice";
import { getLoginSession } from "@/storage/session";

export const AdminGuard = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAdmin = async () => {
      const token = getLoginSession();
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try { 
        const response = await apiService.getWithParams('validate', {
          token: token,
          required_roles: ['admin'],
        });
        
        
        setIsAuthorized(response.valid);
      } catch (error) {
        console.error("Error validating admin:", error);
        setIsAuthorized(false);
      }
    };

    validateAdmin();
  }, []);

  if (isAuthorized === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate replace to={PublicRoutes.HOME} />;
};