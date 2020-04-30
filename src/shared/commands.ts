import { ITwitchCommand } from './types/CommandTypes';
import { DiscordCommand } from './types/commands/DiscordCommand';
import { MmrCommand } from './types/commands/MmrCommand';
import { PlaysoundCommand } from './types/commands/PlaysoundCommand';

export const TwitchCommands: ITwitchCommand[] = [
	new DiscordCommand(),
	new MmrCommand(),
	new PlaysoundCommand(),
];
