import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const createUserDTO: CreateUserDTO = {
    birthAt: '2000-01-01',
    email: 'nome1@email.com',
    name: 'Nome 1',
    password: '123456',
    role: Role.User,
};
