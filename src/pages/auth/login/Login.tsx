import MainLayout from '@/templates/MainLayout';
import Login_form from '@/components/forms/Login_form';

const Login = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Iniciar Sesión</h2>
        <Login_form />
      </div>
    </MainLayout>
  );
};

export default Login;
