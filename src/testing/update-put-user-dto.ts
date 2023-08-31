import { Role } from '../enums/role.enum';
import { UpdatePutUserDTO } from '../user/dto/update-put-user.dto';

export const updatePutUserDTO: UpdatePutUserDTO = {
    birthAt: '2000-01-01',
    email: 'nome1@email.com',
    name: 'Nome 1',
    password: '123456',
    role: Role.User,
};
