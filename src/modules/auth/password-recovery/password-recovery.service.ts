import {
    BadRequestException,
    Injectable,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { Request } from 'express'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { MailService } from '../../libs/mail/mail.service'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) {}

    public async resetPassword(
        req: Request,
        input: ResetPasswordInput,
        userAgent: string
    ) {
        const { email } = input

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            throw new NotAcceptableException('Пользователь не найден')
        }

        const resetToken = await generateToken(
            this.prismaService,
            user,
            TokenType.RESET_PASSWORD
        )

        const metadata = getSessionMetadata(req, userAgent)

        await this.mailService.sendPasswordResetToken(
            user.email,
            resetToken.token,
            metadata
        )

        return true
    }

    public async newPassword(input: NewPasswordInput) {
        const { password, token } = input

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.RESET_PASSWORD
            }
        })

        if (!existingToken) {
            throw new NotFoundException('Токен не найден')
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException('Токен истек')
        }

        await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                password: await hash(password)
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.RESET_PASSWORD
            }
        })

        return true
    }
}
