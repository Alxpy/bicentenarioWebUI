import { BrowserRouter, Route} from 'react-router-dom';
import { Home,Login,Register } from '../pages';
import RoutesNotFound  from '@/utilities/RoutesNotFound';
import {PublicRoutes, PrivateRoutesAdmin } from './routes'
import {AuthGuard, AdminGuard} from '@/guards';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <RoutesNotFound>
        <Route path={PublicRoutes.HOME} element={<Home />} />
        <Route path={PublicRoutes.LOGIN} element={<Login />} />
        <Route path={PublicRoutes.REGISTER} element={<Register />} />   

        <Route element={<AuthGuard/>}>

          <Route element={<AdminGuard/>}>
            <Route path={`${PrivateRoutesAdmin.BASE}/*`} element={<>ADMIN</>}/>
          </Route>
        </Route>
        
      </RoutesNotFound>
    </BrowserRouter>
  );
};

export default AppRoutes;