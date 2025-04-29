import { atom } from "jotai";
import { IUserGeneral, IHistory, ILibro } from "@/components/interface";

export const emailAtom = atom<string>("");
export const openUserSettingsAtom = atom<boolean>(false);

export const openAdminUserAtom = atom<boolean>(false);
export const userAdminEditAtom = atom<IUserGeneral>();

export const openAdminCreateUserAtom = atom<boolean>(false);

export const openAdminHistoryAtom = atom<boolean>(false);
export const openAdminCreateHistoryAtom = atom<boolean>(false);
export const  historyAdminEditAtom  = atom<IHistory>();

export const openAdminBibliotecaAtom = atom<boolean>(false);
export const openAdminCreateBibliotecaAtom = atom<boolean>(false);
export const libroAdminEditAtom = atom<ILibro>();

export const openAdminRolesAtom = atom<boolean>(false);

