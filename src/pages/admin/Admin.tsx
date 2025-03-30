import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoutesAdmin } from '@/routes/routes'
import { Dashboard } from './dashboard/Dashboard'
import RoutesNotFound from '@/utilities/RoutesNotFound'

export const Admin = () => {

  return (
    <RoutesNotFound>
            <Route path="/" element={<Navigate to={PrivateRoutesAdmin.DASHBOARD} />} />
            <Route 
              path={PrivateRoutesAdmin.DASHBOARD} 
              element={<Dashboard />} 
            />  
    </RoutesNotFound>
  )
}