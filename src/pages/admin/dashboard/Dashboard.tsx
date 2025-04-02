import React from 'react'
import { 
  Users, 
  BarChart2, 
  FileText, 
  Settings,
  ArrowRight,
  Activity,
  Shield
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MainLayout from '@/templates/MainLayout'
import { RoleLayout } from '@/templates/RoleLayout'
const areas = [
  {
    title: 'Gestión de Usuarios',
    description: 'Administra los usuarios y permisos del sistema',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-800',
    link: '/admin/users',
    stats: '1,240 usuarios'
  },
  {
    title: 'Estadísticas',
    description: 'Métricas y análisis de rendimiento',
    icon: <BarChart2 className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-800',
    link: '/admin/stats',
    stats: '+15% este mes'
  },
  {
    title: 'Gestión de Contenido',
    description: 'Administra el contenido del sitio web',
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-green-100 text-green-800',
    link: '/admin/content',
    stats: '428 artículos'
  },
  {
    title: 'Configuración',
    description: 'Ajustes del sistema y preferencias',
    icon: <Settings className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-800',
    link: '/admin/settings',
    stats: '3 alertas'
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03 }
}

export const Dashboard = () => {
  return (
    <RoleLayout role="admin">
      <div className=" mt-1 bg-slate-900 rounded-xl p-6 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-600" />
              Panel de Administración
            </h1>
            <p className="text-gray-300 mt-2">
              Bienvenido al centro de control de tu plataforma
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.3 }}
            className="col-span-1"
          >
            <Card className="border-l-4 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Usuarios activos
                </CardTitle>
                <Users className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,240</div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  +12% este mes
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover="hover"
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className={`p-3 rounded-lg ${area.color}`}>
                    {area.icon}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardTitle className="text-xl">{area.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {area.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{area.stats}</span>
                  <Button variant="outline" size="sm">
                    Acceder
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>Eventos importantes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
            
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Nuevo usuario registrado</p>
                      <p className="text-sm text-gray-500">Hace 2 horas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </RoleLayout>
  )
}