import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Multimedia } from './HistoriaMultimedia'
interface IBibliotecaProrops {
    id_historia: number
    open: boolean
    onClose: () => void
}

export const DialogMul = ({ open, onClose, id_historia }: IBibliotecaProrops) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] max-h-[100vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
                <DialogHeader>
                    <DialogTitle>Multimedia</DialogTitle>
                    <DialogDescription>Gestion de multimedia.</DialogDescription>
                </DialogHeader>
                <Multimedia historyId={id_historia} />
            </DialogContent>
        </Dialog>
    )
}
