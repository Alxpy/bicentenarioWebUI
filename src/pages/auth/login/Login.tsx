import MainLayout from '@/templates/MainLayout';
import Login_form from '@/components/forms/Login_form';
import videoLogin from '@/assets/video.mp4';
import BackgroundVideoPlayer from "react-background-video-player";

const Login = () => {
  return (
    <MainLayout>
      <div className="relative w-full h-screen flex items-center justify-center">
        <BackgroundVideoPlayer
          videoSrc={videoLogin} // El video que usarás como fondo
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

        <div className="relative w-full max-w-md bg-white bg-opacity-90 shadow-lg rounded-lg p-6 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Iniciar Sesión</h2>
          <Login_form />
        </div>
      </div>
    </MainLayout>
  );

};

export default Login;
