import { Field, ID, ObjectType } from '@nestjs/graphql'

import { User } from '@/prisma/generated'

import { SocialLinkModel } from '../../profile/models/social-link.model'

@ObjectType()
export class UserModel implements User {
    @Field(() => ID)
    public id: string
    @Field(() => Date)
    public createdAt: Date

    @Field(() => String)
    public email: string

    @Field(() => String)
    public password: string

    @Field(() => String)
    public username: string

    @Field(() => String)
    public displayName: string

    @Field(() => String, { nullable: true })
    public bio: string

    @Field(() => String, { nullable: true })
    public avatar: string

    @Field(() => String, { nullable: true })
    public totpSecret: string

    @Field(() => Date, { nullable: true })
    public diactivatedAt: Date

    @Field(() => Boolean)
    public isDeactivated: boolean

    @Field(() => Boolean)
    public isVerified: boolean

    @Field(() => Boolean)
    public isEmailVerified: boolean

    @Field(() => Boolean)
    public isTotpEnabled: boolean

    @Field(() => [SocialLinkModel])
    public socialLinks: SocialLinkModel[]

    @Field(() => Date)
    public updatedAt: Date
}
