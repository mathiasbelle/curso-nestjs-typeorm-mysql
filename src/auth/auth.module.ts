import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { FileModule } from "src/file/file.module";

@Module({
    imports: [
        FileModule,
        JwtModule.register({
        secret: process.env.JWT_SECRET
        }),
        forwardRef(() => UserModule),
        PrismaModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {

}