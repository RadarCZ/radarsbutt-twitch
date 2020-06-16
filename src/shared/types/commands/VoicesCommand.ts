import { TwitchClient } from '@twitch';
import { TwitchCommandHandler, ITwitchCommand } from '../CommandTypes';

export class VoicesCommand implements ITwitchCommand {
	public name = 'voices';
	public description = 'Shows a link to available TTS voices.';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public handler: TwitchCommandHandler = (channel, userstate, message): void => {
		const client = TwitchClient.getInstance();
		client.say(channel, 'The list of available voices is here: https://supinic.com/stream/tts');
	}
};