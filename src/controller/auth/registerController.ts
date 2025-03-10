import { iUser_Register } from "@/components/interface/iuser";
import { apiService } from "@/service/apiservice";
import {mesageResponse} from "@/components/interface/iresponse";


class RegisterController {

  async register(user: iUser_Register) {
    console.log(user.apellidoMaterno);
    try {
      const response = await apiService.create("register", {
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
      }).then((response) => {
        const data : mesageResponse = response.response
        console.log(data);
        return data;
      })
        .catch((error) => error)
        .finally(() => console.log("Petición finalizada"))
      ;
      
      if (response.success) {
        apiService.get(`send_email/vetify_email/${user.correo}`);
        return { message: "Registro exitoso", type_message: "success" };
      } else {
        return { message: response.error || "Error desconocido", type_message: "error" };
      }
    } catch (err) {
      console.error(err);
      return { message: "Error en el servidor. Intenta nuevamente más tarde.", type_message: "error" };
    }
  }
}

export default new RegisterController();
