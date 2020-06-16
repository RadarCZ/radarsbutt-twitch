import { TwitchClient } from '@twitch';
import { TwitchCommandHandler, ITwitchCommand } from '../CommandTypes';

export class TtsAvailableReminderCommand implements ITwitchCommand {
	public name = 'tts_available';
	public description = 'Reminds chat about the reward :)';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public handler: TwitchCommandHandler = (channel, userstate, message): void => {
		const client = TwitchClient.getInstance();
		client.say(channel, 'Text to speech reward is available now! Be sure to check it out!');
	}
};