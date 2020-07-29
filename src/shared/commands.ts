import { ITwitchCommand } from './types/CommandTypes';
import { DiscordCommand } from './types/commands/DiscordCommand';
import { MmrCommand } from './types/commands/MmrCommand';
import { CommandsCommand } from './types/commands/CommandsCommand';
import { PlaysoundsCommand } from './types/commands/PlaysoundsCommand';
import { TtsAvailableReminderCommand } from './types/commands/TtsAvailableReminderCommand';

export const TwitchCommands: ITwitchCommand[] = [
	new DiscordCommand(),
	new MmrCommand(),
	new CommandsCommand(),
	new PlaysoundsCommand(),
];

export const RemiderCommands: ITwitchCommand[] = [
	new PlaysoundsCommand(),
	new DiscordCommand(),
	new CommandsCommand(),
	new TtsAvailableReminderCommand(),
]
