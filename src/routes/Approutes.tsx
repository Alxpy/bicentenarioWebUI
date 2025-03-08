import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home,Login,Register } from '../pages';



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />   
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;