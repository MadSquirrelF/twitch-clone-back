import { Injectable } from '@nestjs/common'

import { Prisma } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { FiltersInput } from './inputs/filters.input'

@Injectable()
export class StreamService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findAll(input: FiltersInput = {}) {
        const { skip, searchTerm, take } = input

        const whereClause = searchTerm
            ? this.findBySearchTermFilter(searchTerm)
            : undefined
        const streams = await this.prismaService.stream.findMany({
            take: take ?? 12,
            skip: skip ?? 0,
            where: {
                user: {
                    isDeactivated: false
                },
                ...whereClause
            },
            include: {
                user: true
            }
        })

        return streams
    }

    private findBySearchTermFilter(
        searchTerm: string
    ): Prisma.StreamWhereInput {
        return {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    user: {
                        username: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        }
    }
}
