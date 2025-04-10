import { atom } from "jotai";
import { IUserGeneral } from "@/components/interface";

export const emailAtom = atom<string>("");
export const openUserSettingsAtom = atom<boolean>(false);

export const openAdminUserAtom = atom<boolean>(false);
export const userAdminEditAtom = atom<IUserGeneral>();

export const openAdminCreateUserAtom = atom<boolean>(false);