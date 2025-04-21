import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { iPresidente } from '../interface'

interface DialoEditProps {
    open: boolean
    onClose: () => void
    presidente: iPresidente | null
}

export const DialogEdit = ({ open, onClose, presidente }: DialoEditProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
                <DialogHeader>
                    <DialogTitle>Editar los datos de Presidente</DialogTitle>
                    <DialogDescription>Editar.</DialogDescription>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}
