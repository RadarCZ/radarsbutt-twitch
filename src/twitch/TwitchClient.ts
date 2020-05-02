import { client, Client, Events } from 'tmi.js';

import { TwitchOptions } from './TwitchOptions';
import { RemiderCommands } from '@shared/commands';

export class TwitchClient {
	public static create(
		options: TwitchOptions, handlers: { event: keyof Events; listener: (...args: any[]) => void}[]): void {
		if (!TwitchClient.instance) {
			TwitchClient.instance = new TwitchClient(options, handlers);
		}
	}

	public static getInstance(): TwitchClient {
		return TwitchClient.instance;
	}

	private static instance: TwitchClient;
	private client: Client;
	private remindCommandsCount: number;
	private lastReminderIndex: number | null = null;

	private constructor(options: TwitchOptions, handlers: { event: keyof Events; listener: (...args: any[]) => void}[]) {
		this.remindCommandsCount = RemiderCommands.length;
		this.client = client(options);
		handlers.map(handler => {
			this.client.on(handler.event, handler.listener);
		});
	}

	public connect(): Promise<[string, number]> {
		return this.client.connect();
	}

	public say(target: string, message: string): Promise<[string]> {
		return this.client.say(target, message);
	}

	public whisper(target: string, message: string): Promise<[string, string]> {
		return this.client.whisper(target, message);
	}

	private remind(): void {
		if (!this.lastReminderIndex || this.lastReminderIndex === this.remindCommandsCount) {
			this.lastReminderIndex = 0;
		}

		RemiderCommands[this.lastReminderIndex].handler(process.env.TWITCH_CHANNEL_NAME || 'radarcz');
		this.lastReminderIndex++;
	}

	public remindBound = (): void => {
		this.remind();
	}
}
