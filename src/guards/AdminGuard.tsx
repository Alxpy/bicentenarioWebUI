import { Navigate, Outlet } from "react-router-dom";
import { useJwt } from "react-jwt";
import { PublicRoutes } from "@/routes/routes";
import { apiService } from "@/services/apiServices";
import React from "react";

export const AdminGuard = () => {
    const checkAuthorized = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = useJwt(token).decodedToken;
                if (decodedToken && decodedToken.role === "ADMIN") {
                    return true;
                } else {
                    console.error("Access denied: Invalid role.");
                    return false;
                }
            } catch (error) {
                console.error("Error decoding token", error);
                return false;
            }
        } else {
            console.error("No token found.");
            return false;
        }
    };

    const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const result = checkAuthorized();
        setIsAuthorized(result);
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />;
};

export default AdminGuard;
