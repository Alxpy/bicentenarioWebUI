import { iUser_token } from "@/components/interface/iuser";

export const saveLoginSession = (session: iUser_token) => {
    localStorage.setItem("session_token", JSON.stringify(session));
}

export const getLoginSession = () => {
    const session = localStorage.getItem("session_token");
    return session ? JSON.parse(session) : null;
}

export const removeLoginSession = () => {
    localStorage.removeItem("session_token");
}
