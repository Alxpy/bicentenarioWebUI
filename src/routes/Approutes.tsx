// AppRoutes.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Login, Register, Auth, Verify } from '../pages';
import RoutesNotFound from '@/utilities/RoutesNotFound';
import { PublicRoutes, PrivateRoutesAdmin } from './routes';
import { AuthGuard, AdminGuard } from '@/guards';
import { Admin } from '@/pages/admin/Admin';
import { Historia } from '@/pages/historia/Historia';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <RoutesNotFound>
        <Route path={PublicRoutes.HOME} element={<Home />} />
        <Route path={PublicRoutes.LOGIN} element={<Login />} />
        <Route path={PublicRoutes.REGISTER} element={<Register />} />
        <Route path={PublicRoutes.AUTH} element={<Auth />} />
        <Route path={PublicRoutes.VERIFY} element={<Verify />} />
        <Route path={PublicRoutes.HISTORIA} element={<Historia />} />

        <Route path={`${PrivateRoutesAdmin.BASE}/*`} element={<Admin />}>

          <Route element={<AuthGuard />}>
            <Route element={<AdminGuard />}>

            </Route>
          </Route>
        </Route>

      </RoutesNotFound>
    </BrowserRouter>
  );
};

export default AppRoutes;