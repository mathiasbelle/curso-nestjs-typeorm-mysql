import { Role } from '../enums/role.enum';

export const userEntityList = [
    {
        name: 'Nome 1',
        email: 'nome1@email.com',
        birthAt: new Date('2000-01-01'),
        id: 1,
        password:
            '$2b$10$N3vG4uEJdmN7n8A9FXLBOOqoKCQUHx1x5Fe1CL41RzIvCKI2KhLx6',
        role: Role.Admin,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Nome 2',
        email: 'nome2@email.com',
        birthAt: new Date('2000-01-01'),
        id: 1,
        password:
            '$2b$10$N3vG4uEJdmN7n8A9FXLBOOqoKCQUHx1x5Fe1CL41RzIvCKI2KhLx6',
        role: Role.Admin,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Nome 3',
        email: 'nome3@email.com',
        birthAt: new Date('2000-01-01'),
        id: 1,
        password:
            '$2b$10$N3vG4uEJdmN7n8A9FXLBOOqoKCQUHx1x5Fe1CL41RzIvCKI2KhLx6',
        role: Role.Admin,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
