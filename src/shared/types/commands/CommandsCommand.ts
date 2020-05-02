import { ITwitchCommand, TwitchCommandHandler } from '../CommandTypes';
import { TwitchClient } from '@twitch';

export class CommandsCommand implements ITwitchCommand {
	public name = 'commands';
	public description = 'Shows a link to this page.';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public handler: TwitchCommandHandler = (channel, userstate, message): void => {
		const client = TwitchClient.getInstance();
		client.say(channel, `The list of commands is here: http://${process.env.PRODUCTION_HOSTNAME}/commands`);
	}
};