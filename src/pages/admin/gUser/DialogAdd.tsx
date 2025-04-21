import React from 'react'
import { useAtom } from 'jotai'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
  } from "@/components/ui/dialog"
import { openAdminCreateUserAtom, userAdminEditAtom } from '@/context/context'
import {FormUserAdm} from './FormUse'
interface UserSettingsProps {
  onSuccess: () => void;
}


export const DialogAdd = ({onSuccess}:UserSettingsProps) => {

     const [open, setOpen] = useAtom(openAdminCreateUserAtom)
        const [user] = useAtom(userAdminEditAtom)

  return (
       <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
            <DialogHeader className="border-b border-white/10">
              <DialogTitle className="mb-5 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Crear
              </DialogTitle>
            </DialogHeader>
            <div className="p-1">
                <FormUserAdm mode='create'/>
            </div>
          </DialogContent>
        </Dialog>
  )
}
