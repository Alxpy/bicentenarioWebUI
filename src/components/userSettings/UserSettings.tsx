import { useAtom } from 'jotai'
import { openUserSettingsAtom } from '@/context/context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { TabsSettings } from './TabsSettings'

const UserSettings = () => {
  const [open, setOpen] = useAtom(openUserSettingsAtom)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[90vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Configuración de Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Gestiona tu información personal y seguridad
          </DialogDescription>
        </DialogHeader>
        <div className="p-1">
          <TabsSettings />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserSettings