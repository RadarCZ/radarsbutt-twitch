import logger from '@shared/Logger';
import { Events, ChatUserstate } from 'tmi.js';
import { TwitchCommands } from '@shared/commands';
import { TwitchClient } from '@twitch';
import { restartApp } from '@shared/functions';

export const Handlers: { event: keyof Events; listener: (...args: any[]) => void }[] = [
	{
		'event': 'connected',
		'listener': (address: string, port: number): void => {
			logger.info(`Connected to ${address}:${port}`);
		}
	},
	{
		'event': 'disconnected',
		'listener': (reason: string): void => {
			logger.info(`Bot was disconnected from Twitch IRC. Reason: "${reason}"`);
			restartApp();
		}
	},
	{
		'event': 'message',
		'listener': (channel: string, userState: ChatUserstate, message: string, self: boolean): void => {
			if (self) {
				return;
			}

			const cleanMessage: string = message.trim();

			if (!cleanMessage.startsWith('!')) {
				return;
			}

			const command: string = (cleanMessage.split(' ')[0]).substring(1);

			const twitchCmd = TwitchCommands.find(cmd => cmd.name === command);

			if(twitchCmd) {
				twitchCmd.handler(channel, userState, message);
			} else {
				const client = TwitchClient.getInstance();
				client.say(channel, 'I don\'t know that command yet FeelsBadMan');
			}
		}
	}
];
