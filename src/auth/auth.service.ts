import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private readonly jweService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) {}

    createToken(user: User) {
        return {
            accessToken: this.jweService.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                {
                    expiresIn: '7 days',
                    subject: String(user.id),
                    issuer: 'login',
                    audience: 'users',
                },
            ),
        };
    }

    checkToken(token: string) {
        try {
            const data = this.jweService.verify(token, {
                audience: 'users',
                issuer: 'login',
            });
            return data;
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async login(email: string, password: string) {
        //console.log(process.env);
        const user = await this.prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            throw new UnauthorizedException('Email incorreto.');
        }

        const token = this.jweService.sign(
            {
                id: user.id,
            },
            {
                expiresIn: '30 minutes',
                subject: String(user.id),
                issuer: 'forget',
                audience: 'users',
            },
        );

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'mathias@email.com',
            template: 'forget',
            context: {
                name: user.name,
                token,
            },
        });

        return user;
    }

    async reset(password: string, token: string) {

        try {
            const data = this.jweService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            });
            
            if (isNaN(Number(data.id))) {
              throw new BadRequestException('Token inválido.')
            }

            password = await bcrypt.hash(password, await bcrypt.genSalt());

            const user = await this.prisma.user.update({
                where: {
                    id: Number(data.id),
                },
                data: {
                    password,
                },
            });

            return this.createToken(user);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
