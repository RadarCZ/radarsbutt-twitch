import { cloneDeep } from 'lodash';

import { HbsHelpers } from './hbs-helpers';
import { MenuLink } from './types/AppLocalsTypes';

import logger from './Logger';
import hbs = require('hbs');
import { TwitchCommands } from './commands';

export const pErr: (err: Error) => void = err => {
    if (err) {
        logger.error(err);
    }
};

export const getRandomInt: () => void = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export const registerHelpers: () => typeof hbs = () => {
	HbsHelpers.forEach(helper => {
		hbs.registerHelper(helper.callName, helper.handler);
	});

	return hbs;
}

export const buildMenu: (app: any) => void = (app) => {
	const links: MenuLink[] = [
		{ href: '/', title: 'Stream', name: 'index' },
		{ href: '/commands', title: 'Commands', name: 'commands' },
	];

	app.locals.links = links;
};

export const registerCommands: (app: any) => void = (app) => {
	const sortedCommands = cloneDeep(TwitchCommands).sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	app.locals.commands = sortedCommands;
};
