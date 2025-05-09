import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { NoticiaForm } from './NoticiaForm'

interface DialogAddProps {
    open: boolean
    onClose: () => void
}

export const DialogAdd = ({ open, onClose }: DialogAddProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
                <DialogHeader>
                    <DialogTitle>Agregar Noticia</DialogTitle>
                    <DialogDescription>Agrega una nueva noticia.</DialogDescription>
                </DialogHeader>
                    <NoticiaForm/>
            </DialogContent>
        </Dialog>
    )
}
