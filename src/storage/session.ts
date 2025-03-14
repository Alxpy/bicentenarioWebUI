import { iUser } from "@/components/interface/iuser";
import { apiService } from "@/service/apiservice";

export const saveLoginSession = async (session: string) => {
    localStorage.setItem("session_token", JSON.stringify(session));
    await apiService.get(`data?token=${session}`).then((res) => {
        const user: iUser = res.data;
        localStorage.setItem("user", JSON.stringify(user));
    }).catch((error) => {
    }
    );
}

export const getLoginSession = () => {
    const session = localStorage.getItem("session_token");
    return session ? JSON.parse(session) : null;
}

export const getUser = () => {
    const session = localStorage.getItem("user");
    return session ? JSON.parse(session) : null;
}

export const removeLoginSession = () => {
    localStorage.removeItem("user");
}

export const saveEmail = (email: string) => {
    localStorage.setItem("email", email);
}

export const getEmail = () => {
    return localStorage.getItem("email");
}

export const removeEmail = () => {
    localStorage.removeItem("email");
}
