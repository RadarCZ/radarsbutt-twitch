import { ITwitchCommand, TwitchCommandHandler } from '../CommandTypes';
import { TwitchClient } from '@twitch';

export class DiscordCommand implements ITwitchCommand {
	public name = 'discord';
	public description = 'Shows up-to-date discord link. Everyone can join!';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public handler: TwitchCommandHandler = (channel, userstate, message): void => {
		const client = TwitchClient.getInstance();
		client.say(channel, `Our discord channel is free to join for everyone! ${process.env.DISCORD_INVITE_LINK}`);
	}
};