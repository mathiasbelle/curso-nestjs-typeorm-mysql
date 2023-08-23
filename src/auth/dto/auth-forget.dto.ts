import { IsEmail } from "class-validator";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

export class AuthForgetDTO {
    @IsEmail()
    email: string;
}