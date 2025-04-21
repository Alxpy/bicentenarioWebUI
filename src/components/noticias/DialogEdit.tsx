import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { iNews } from '../interface'
import { NoticiaForm } from './NoticiaForm'
interface DialoEditProps {
    open: boolean
    onClose: () => void
    noticia: iNews
}

export const DialogEdit = ({ open, onClose, noticia }: DialoEditProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
                <DialogHeader>
                    <DialogTitle>Editar los datos de Notica</DialogTitle>
                    <DialogDescription>Editar.</DialogDescription>
                </DialogHeader>
                <NoticiaForm
                    initialData={noticia}
                />
            </DialogContent>
        </Dialog>
    )
}
