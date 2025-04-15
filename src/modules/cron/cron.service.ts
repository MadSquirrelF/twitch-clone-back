import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'

@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) {}
    // @Cron('*/10 * * * * *')
    @Cron('0 0 * * *')
    public async deleteDeactivatedAccounts() {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        // sevenDaysAgo.setSeconds(sevenDaysAgo.getSeconds() - 5)

        const deactivatedAccounts = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true,
                diactivatedAt: {
                    lte: sevenDaysAgo
                }
            }
        })

        for (const user of deactivatedAccounts) {
            await this.mailService.sendAcccountDeletion(user.email)
        }

        console.log('D-A:', deactivatedAccounts)

        await this.prismaService.user.deleteMany({
            where: {
                isDeactivated: true,
                diactivatedAt: {
                    lte: sevenDaysAgo
                }
            }
        })
    }
}
