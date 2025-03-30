import { Module } from '@nestjs/common'

import { MailService } from '../../libs/mail/mail.service'
import { VerificationService } from '../verification/verification.service'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
    providers: [
        AccountResolver,
        AccountService,
        VerificationService,
        MailService
    ]
})
export class AccountModule {}
