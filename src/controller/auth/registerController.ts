import { iUser_Register } from "@/components/interface/iuser";
import { apiService } from "@/service/apiservice";
import {IApiResponse} from "@/components/interface/iresponse";


class RegisterController {

  async register(user: iUser_Register) {
    console.log(user.apellidoMaterno);
    try {
      const response: IApiResponse = await apiService.post("user", {
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        correo: user.correo,
        contrasena: user.contrasena,
        genero: user.genero,
        telefono: user.telefono,
        pais: user.pais,
        ciudad: user.ciudad,
        estado: true,
        id_rol: 2,
      }).then((response : IApiResponse) => {
        return response;
      })
        .catch((error) => error)
        .finally(() => console.log("Petición finalizada"))
      ;
      
      if (response.success) {
        apiService.post(`emails/verification`,{
          email : user.correo
        });
        
      }
      return { message: response.message, type_message: response.success };
    } catch (err) {
      console.error(err);
      return { message: "Error en el servidor. Intenta nuevamente más tarde.", type_message: false };
    }
  }
}

export default new RegisterController();
