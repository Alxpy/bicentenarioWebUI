import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Multimedia } from './CulturaMultimedia'
interface IBibliotecaProrops {
    id_cultura: number
    open: boolean
    onClose: () => void
}

export const DialogMul = ({ open, onClose, id_cultura }: IBibliotecaProrops) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] max-h-[100vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
                <DialogHeader>
                    <DialogTitle>Multimedia</DialogTitle>
                    <DialogDescription>Gestion de multimedia.</DialogDescription>
                </DialogHeader>
                <Multimedia culturaId={id_cultura} />
            </DialogContent>
        </Dialog>
    )
}
