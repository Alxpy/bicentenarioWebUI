import { iUser } from "@/components/interface";

export const saveLoginSession = async (data: any) => {
    localStorage.setItem("session_token", JSON.stringify(data.token));
    localStorage.setItem("user", JSON.stringify(data.user));
}

export const getLoginSession = () => {
    const session = localStorage.getItem("session_token");
    return session;
}

export const getUser = () => {
    const session = localStorage.getItem("user");
    return session ? JSON.parse(session) : null;
}

export const removeLoginSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("session_token");
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
