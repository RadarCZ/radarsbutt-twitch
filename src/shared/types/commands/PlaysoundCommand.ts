import { ITwitchCommand, TwitchCommandHandler } from '../CommandTypes';
import watersports from 'ws';

export class PlaysoundCommand implements ITwitchCommand {
	public name = 'playsound';
	public description = 'Plays a short sound on stream. List of available sounds <a href="/playsounds">here</a>.';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public handler: TwitchCommandHandler = (channel, userstate, message): void => {
		const wsc = new watersports(`ws://localhost:${process.env.WEBSOCKET_PORT}`);
		wsc.onopen = (event): void => {
			const data = JSON.stringify({ message, userstate })
			event.target.send(data);
			event.target.close();
		}
	}
};