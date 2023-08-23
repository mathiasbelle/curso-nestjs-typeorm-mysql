import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {

    }

    async create(data: CreateUserDTO) {

        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

        return await this.prisma.user.create({data});
    }

    async list() {
        return await this.prisma.user.findMany();
    }

    async show(id: number) {
        await this.exists(id);
        return await this.prisma.user.findUnique({where: {id}});
    }

    async update(id: number, {email, name, password, birthAt, role}: UpdatePutUserDTO) {
        await this.exists(id);
        password = await bcrypt.hash(password, await bcrypt.genSalt());
        return this.prisma.user.update({
            where: {
                id
            },
            data: {email, name, password, birthAt: birthAt ? new Date(birthAt) : null, role}
        });
    }

    async updatePartial(id: number, {email, name, password, birthAt, role}: UpdatePatchUserDTO) {
        await this.exists(id);
        const data: any = {};
        if (email) {
            data.email = email;
        }

        if (name) {
            data.name = name;
        }

        if (password) {
            data.password = await bcrypt.hash(password, await bcrypt.genSalt());;
        }

        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }

        if (role) {
            data.role = role;
        }

        return this.prisma.user.update({
            where: {
                id
            },
            data
        });
    }

    async delete(id: number) {

        await this.exists(id);

        return this.prisma.user.delete({
            where : {
                id
            }
        });

    }

    async exists(id: number) {
        if (!(await this.prisma.user.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }
    
}