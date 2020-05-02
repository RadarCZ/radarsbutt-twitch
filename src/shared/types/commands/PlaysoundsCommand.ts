import { ITwitchCommand, TwitchCommandHandler } from '../CommandTypes';
import { TwitchClient } from '@twitch';

export class PlaysoundsCommand implements ITwitchCommand {
	public name = 'playsounds';
	public description = 'Shows a link to the playsounds page.';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public handler: TwitchCommandHandler = (channel, userstate, message): void => {
		const client = TwitchClient.getInstance();
		client.say(channel, `The list of available sounds is here: http://${process.env.PRODUCTION_HOSTNAME}/playsounds`);
	}
};