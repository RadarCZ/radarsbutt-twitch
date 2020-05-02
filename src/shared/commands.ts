import { ITwitchCommand } from './types/CommandTypes';
import { DiscordCommand } from './types/commands/DiscordCommand';
import { MmrCommand } from './types/commands/MmrCommand';
import { PlaysoundCommand } from './types/commands/PlaysoundCommand';
import { CommandsCommand } from './types/commands/CommandsCommand';
import { PlaysoundsCommand } from './types/commands/PlaysoundsCommand';

export const TwitchCommands: ITwitchCommand[] = [
	new DiscordCommand(),
	new MmrCommand(),
	new PlaysoundCommand(),
	new CommandsCommand(),
	new PlaysoundsCommand(),
];

export const RemiderCommands: ITwitchCommand[] = [
	new PlaysoundsCommand(),
	new DiscordCommand(),
	new CommandsCommand(),
]
