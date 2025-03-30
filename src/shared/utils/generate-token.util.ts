import { v4 as uuidv4 } from 'uuid'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

export async function generateToken(
    prismaService: PrismaService,
    user: User,
    type: TokenType,
    IsUUID: boolean = false
) {
    let token: string

    if (IsUUID) {
        token = uuidv4()
    } else {
        token = Math.floor(
            Math.random() * (1000000 - 1000000) + 100000
        ).toString()
    }

    const expiresIn = new Date(new Date().getTime() + 300000)

    const existingToken = await prismaService.token.findFirst({
        where: {
            type: type,
            user: {
                id: user.id
            }
        }
    })

    if (existingToken) {
        await prismaService.token.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const newToken = await prismaService.token.create({
        data: {
            token,
            expiresIn,
            type,
            user: {
                connect: {
                    id: user.id
                }
            }
        },
        include: {
            user: true
        }
    })

    return newToken
}
