import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    async create(data: CreateUserDTO) {
        if (
            await this.usersRepository.exist({
                where: {
                    email: data.email,
                },
            })
        ) {
            throw new BadRequestException('O email já esta em uso.');
        }

        data.password = await bcrypt.hash(
            data.password,
            await bcrypt.genSalt(),
        );

        const user = this.usersRepository.create(data);

        return await this.usersRepository.save(user);
    }

    async list() {
        return await this.usersRepository.find();
    }

    async show(id: number) {
        await this.exists(id);
        return await this.usersRepository.findOneBy({ id });
    }

    async update(
        id: number,
        { email, name, password, birthAt, role }: UpdatePutUserDTO,
    ) {
        await this.exists(id);
        password = await bcrypt.hash(password, await bcrypt.genSalt());
        await this.usersRepository.update(id, {
            email,
            name,
            password,
            birthAt: birthAt ? new Date(birthAt) : null,
            role,
        });

        return this.show(id);
    }

    async updatePartial(
        id: number,
        { email, name, password, birthAt, role }: UpdatePatchUserDTO,
    ) {
        await this.exists(id);
        const data: any = {};
        if (email) {
            data.email = email;
        }

        if (name) {
            data.name = name;
        }

        if (password) {
            data.password = await bcrypt.hash(password, await bcrypt.genSalt());
        }

        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }

        if (role) {
            data.role = role;
        }

        await this.usersRepository.update(id, data);
        return this.show(id);
    }

    async delete(id: number) {
        await this.exists(id);

        await this.usersRepository.delete(id);

        return true;
    }

    async exists(id: number) {
        if (
            !(await this.usersRepository.exist({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }
}
