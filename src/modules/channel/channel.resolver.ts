import { Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}
}
