import { IsEmail, IsStrongPassword } from "class-validator";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

export class AuthRegisterDTO extends CreateUserDTO{
    @IsEmail()
    email: string;
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0
    })
    password: string;
}