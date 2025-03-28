import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'

export const ChangePassword = () => {
  return (
    <div className="h-full overflow-y-auto  ">
      <div className="space-y-6 p-6 flex-1">
        <h3 className="text-xl font-semibold text-white mb-6">Cambiar Contraseña</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">Contraseña Actual</Label>
            <div className="relative">
              <Input 
                type="password" 
                placeholder="Ingresa tu contraseña actual"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">Nueva Contraseña</Label>
            <div className="relative">
              <Input 
                type="password" 
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input 
                type="password" 
                placeholder="Confirma tu nueva contraseña"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10">
        <Button 
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-teal-500/20"
        >
          Cambiar Contraseña
        </Button>
      </div>
    </div>
  )
}