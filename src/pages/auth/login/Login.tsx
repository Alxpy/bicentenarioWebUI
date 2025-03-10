import Login_form from '@/components/forms/Login_form';

const Login = () => {
  return (
    <div className="w-full h-[100%] flex items-center justify-center "> 
      <div 
        className="w-full sm:w-[100%] md:w-[100%] lg:w-[40%] max-w-2xl inset-shadow-sm inset-shadow-slate-950 shadow-xl rounded-3xl p-6 border border-gray-200 backdrop-blur-lg"
        style={{
          background: "rgba(149, 149, 149, 0.4)",
        }}
      >
        <h1 className="text-xl text_general sm:text-2xl font-semibold text-center mb-4">
          Iniciar Sesión
        </h1>
        <Login_form />
      </div>
    </div>
  );
};

export default Login;
