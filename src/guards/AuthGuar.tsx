import { useJwt } from "react-jwt"; 
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "@/routes/routes";
import { iUser_token } from "@/components/interface/iuser";
import { getLoginSession } from "@/storage/session";

export const AuthGuard = () => {

     const checkAuthentication = () => {
        const token = getLoginSession();
        if (token) {
            try {
                return true;
                const { decodedToken } = useJwt(token);
                const decoded: iUser_token = decodedToken as iUser_token;
                const isExpired = decoded.expires ? decoded.expires * 1000 < Date.now() : true;
                return (!isExpired);
            } catch (error) {
                console.error("Token inválido", error);
                return false;
            }
        } else {
            return false;
        }
    };

    return checkAuthentication() ? <Outlet/> : <Navigate replace to={PublicRoutes.AUTH} />;
}

export default AuthGuard;