import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly jweService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) {}

    createToken(user) {
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
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async login(email: string, password: string) {
        const user = await this.usersRepository.findOneBy({ email });

        //console.log(user);

        if (!user) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.usersRepository.findOneBy({ email });
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

        console.log(token);

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'mathias@email.com',
            template: 'forget',
            context: {
                name: user.name,
                token,
            },
        });

        return { success: true };
    }

    async reset(password: string, token: string) {
        try {
            const data = this.jweService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            });

            if (isNaN(Number(data.id))) {
                throw new BadRequestException('Token inválido.');
            }

            password = await bcrypt.hash(password, await bcrypt.genSalt());

            await this.usersRepository.update(Number(data.id), {
                password,
            });

            const user = this.userService.show(Number(data.id));

            return this.createToken(user);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async register(data: AuthRegisterDTO) {
        delete data.role;

        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
