
export interface iUser_Login {
    email: string;
    password: string;
    };

export interface iUser_Register {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    contrasena: string;
    genero: string;
    telefono: string;
    pais: string;
    ciudad: string;
};

export interface iUser_token{
    token: string;
    status: string;
    message: string;
    expires: number;
};

export interface iUser_token{
    rol: number
}