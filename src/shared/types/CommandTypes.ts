import { ChatUserstate } from 'tmi.js';

export type TwitchCommandHandler = (channel: string, userstate?: ChatUserstate, message?: string) => void;

export interface ITwitchCommand {
	name: string;
	description: string;
	handler: TwitchCommandHandler;
}