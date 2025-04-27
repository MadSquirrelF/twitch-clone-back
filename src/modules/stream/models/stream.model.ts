import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Stream, User } from '@/prisma/generated'

import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.model'

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => ID)
    public id: string

    @Field(() => Date)
    public createdAt: Date

    @Field(() => String)
    public title: string

    @Field(() => String, { nullable: true })
    public thumbnailUrl: string

    @Field(() => String, { nullable: true })
    public ingressId: string

    @Field(() => String, { nullable: true })
    public serverUrl: string

    @Field(() => String, { nullable: true })
    public streamKey: string

    @Field(() => Boolean)
    public isLive: boolean

    @Field(() => CategoryModel, { nullable: true })
    public category: CategoryModel

    @Field(() => String, { nullable: true })
    public categoryId: string

    @Field(() => UserModel)
    public user: UserModel

    @Field(() => String)
    public userId: string

    @Field(() => Date)
    public updatedAt: Date
}
