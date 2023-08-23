import { Body, Controller, Post, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/auth/guards/role.guard";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {

    }
    
    @Post()
    async create(@Body() data: CreateUserDTO) {
        // console.log(name);
        // console.log(email);
        // console.log(password);
        return await this.userService.create(data);
    }

    @Get()
    async list() {
        return await this.userService.list();
    }

    @Get(':id')
    async show(@ParamId() id: number) {
        console.log({id});
        return await this.userService.show(id);
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.update(id, data);

    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
    
}