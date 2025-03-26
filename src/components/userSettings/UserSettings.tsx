import { useAtom } from 'jotai'
import { openUserSettingsAtom } from '@/context/context'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog"
import { TabsSettings } from './TabsSettings'

const UserSettings = () => {

    const [open, setOpen] = useAtom(openUserSettingsAtom)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className='h-[80%] w-[100%] min-w-[60%]' >
        <DialogHeader>
        <DialogTitle>Configuraciones</DialogTitle>
        </DialogHeader>
        <TabsSettings />
    </DialogContent>
    </Dialog>
  )
}

export default UserSettings
