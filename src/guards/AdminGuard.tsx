import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "@/routes/routes";
import React from "react";
import { getLoginSession } from "@/storage/session";

export const AdminGuard = () => {
    const checkAuthorized = () => {
        const token = getLoginSession();
        if (token) {
            return true;
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

    return isAuthorized ? <Outlet /> : <Navigate replace to={PublicRoutes.HOME} />;
};

export default AdminGuard;
