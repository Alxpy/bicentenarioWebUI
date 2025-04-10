import { useAtom } from 'jotai'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { openAdminUserAtom } from '@/context/context'
import {UserSettingsTabs} from './UserTabs'

interface UserSettingsProps {
  onSuccess: () => void;
}

export const DialogEdit = ({onSuccess}:UserSettingsProps) => {

    const [open, setOpen] = useAtom(openAdminUserAtom)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[90vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <DialogHeader className="border-b border-white/10">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Configuración de Usuario
          </DialogTitle>
        </DialogHeader>
        <div className="p-1">
         <UserSettingsTabs/>
        </div>
      </DialogContent>
    </Dialog>
  )
}