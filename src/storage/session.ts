import { iUser } from "@/components/interface/iuser";
import { apiService } from "@/service/apiservice";

export const saveLoginSession = async (session: string) => {
    sessionStorage.setItem("session_token", JSON.stringify(session));
    await apiService.get(`data?token=${session}`).then((res) => {
        const user: iUser = res.data;
        sessionStorage.setItem("user", JSON.stringify(user));
    }).catch((error) => {
    }
    );
}

export const getLoginSession = () => {
    const session = sessionStorage.getItem("session_token");
    return session ? JSON.parse(session) : null;
}

export const getUser = () => {
    const session = sessionStorage.getItem("user");
    return session ? JSON.parse(session) : null;
}

export const removeLoginSession = () => {
    sessionStorage.removeItem("user");
}

export const saveEmail = (email: string) => {
    sessionStorage.setItem("email", email);
}

export const getEmail = () => {
    return sessionStorage.getItem("email");
}

export const removeEmail = () => {
    sessionStorage.removeItem("email");
}
