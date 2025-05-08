// AppRoutes.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Login, Register, Auth, Verify } from '../pages';
import RoutesNotFound from '@/utilities/RoutesNotFound';
import { PublicRoutes, PrivateRoutesAdmin } from './routes';
import { AuthGuard, AdminGuard } from '@/guards';
import { Admin } from '@/pages/admin/Admin';
import { Historia, ShowHistoria } from '@/pages/historia';
import { Biblioteca } from '@/pages/biblioteca/Biblioteca';
import { Presidente } from '@/pages/presidentes/Presidente';
import { PresidenteDetail } from '@/pages/presidentes/PresidenteDetail';
import { Cultura } from '@/pages/cultura/Cultura';
import { ShowCultura } from '@/pages/cultura/ShowCultura';
import { EventosList } from '@/pages/eventos/Evento'
import { ShowEvento } from '@/pages/eventos/ShowEvento';
import { ShowLibro } from '@/pages/biblioteca/ShowLibro'
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
        <Route path={PublicRoutes.SHOWHISTORIA} element={<ShowHistoria />} />
        <Route path={PublicRoutes.BIBLIOTECA} element={<Biblioteca />} />
        <Route path={PublicRoutes.PRESIDENTES} element={<Presidente />} />
        <Route path={PublicRoutes.PRESIDENTE} element={<PresidenteDetail />} />
        <Route path={PublicRoutes.CULTURA} element={<Cultura />} />
        <Route path={PublicRoutes.CULTURA_ID} element={<ShowCultura />} />
        <Route path={PublicRoutes.EVENTOS} element={<EventosList />} />
        <Route path={PublicRoutes.EVENTO_ID} element={<ShowEvento />} />
        <Route path={PublicRoutes.BIBLIOTECA_ID} element={<ShowLibro />} />

        {/* Rutas privadas */}

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