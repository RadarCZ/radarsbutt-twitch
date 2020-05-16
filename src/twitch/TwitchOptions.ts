import { Options } from 'tmi.js';

export class TwitchOptions implements Options {

	public identity: { username: string; password: string };
	public channels: string[];

	public constructor(username: string, password: string, channels: string[]) {
		this.identity = {
			username,
			password
		};
		this.channels = channels;
	}
}
