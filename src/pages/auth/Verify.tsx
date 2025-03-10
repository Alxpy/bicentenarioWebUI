import MainLayout from "@/templates/MainLayout"
import VerifyCode from "@/components/forms/VerifyCode"
import wallper_lago from "@/assets/wallpers/lago.png"

const Verify = () => {
  return (
    <MainLayout>
      <div
      className="inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${wallper_lago})` }}>
        <div className=" w-full h-full flex flex-col items-center justify-center">
          <VerifyCode />
        </div>
        
      </div>
    </MainLayout>
  )
}

export default Verify
