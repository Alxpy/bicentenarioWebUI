import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoutesAdmin } from '@/routes/routes'
import { Dashboard } from './dashboard/Dashboard'
import RoutesNotFound from '@/utilities/RoutesNotFound'

import GetUser from './gUser/GesUser'
import { GesHistoria } from '@/components/historia/GesHistoria'
import  GesBiblioteca  from '@/components/biblioteca/GesBiblioteca'
import { GesPresidente } from '@/components/presidente/GesPresidente'
import { Noticias } from '@/components/noticias/Noticias'
import { Cultura } from '@/components/cultura/Cultura'
import { Evento} from '@/components/evento/Evento'
import { Comentarios } from '@/components/coments/Comentarios'
export const Admin = () => {

  return (
    <RoutesNotFound>
            <Route path="/" element={<Navigate to={PrivateRoutesAdmin.DASHBOARD} />} />
            <Route 
              path={PrivateRoutesAdmin.DASHBOARD} 
              element={<Dashboard />} 
            />  
            <Route path={PrivateRoutesAdmin.USERS} element={<GetUser />} />
            <Route path={PrivateRoutesAdmin.HISTORY} element={<GesHistoria />} />
            <Route path={PrivateRoutesAdmin.BIBLIOTHECA} element={<GesBiblioteca />} />
            <Route path={PrivateRoutesAdmin.PRESIDENTES} element={<GesPresidente/>}/>
            <Route path={PrivateRoutesAdmin.NEWS} element={<Noticias/>}/>
            <Route path={PrivateRoutesAdmin.CULTURA} element={<Cultura/>}/>
            <Route path={PrivateRoutesAdmin.EVENTS} element={<Evento/>}/>
            <Route path={PrivateRoutesAdmin.COMENTARIOS} element={<Comentarios/>}/>

    </RoutesNotFound>
  )
}