import RoutesNotFound from '@/utilities/RoutesNotFound'
import { PrivateRoutesAdmin } from '@/routes/routes'
import { Navigate, Route } from 'react-router-dom'
import React from 'react'

import { Dashboard } from './dashboard/Dashboard'

export const Admin = () => {
  return (
    <RoutesNotFound>
        <Route path="/"  element={<Navigate to={PrivateRoutesAdmin.DASHBOARD}/>}/>
        <Route path={PrivateRoutesAdmin.DASHBOARD} element={<Dashboard/>} />
    </RoutesNotFound>
  )
}
