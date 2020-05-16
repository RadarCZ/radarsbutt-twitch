import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import http from 'http';

import { CronJob } from 'cron';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import { registerHelpers, buildMenu, registerCommands, registerPlaysounds } from '@shared/functions';
import { TwitchOptions } from './twitch/TwitchOptions';
import { TwitchClient } from './twitch/TwitchClient';
import logger from '@shared/Logger';
import { Handlers } from './twitch/Handlers';


// Init express
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

const hbs = registerHelpers();
hbs.localsAsTemplateData(app);

app.set('view engine', 'hbs');
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

hbs.registerPartials(path.join(viewsDir, 'partials'));

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('/', (req: Request, res: Response) => {
	app.locals.activePage = 'index';
	res.render('index', { title: 'Main page' });
});

app.get('/commands', (req: Request, res: Response) => {
	app.locals.activePage = 'commands';
	res.render('commands', { title: 'Commands' });
});
app.get('/playsounds', (req: Request, res: Response) => {
	app.locals.activePage = 'playsounds';
	res.render('playsounds', { title: 'Playsounds' });
});

app.get(`/soundboard-${process.env.SOUNDBOARD_TOKEN}`, (req: Request, res: Response) => {
	res.render('soundboard', { title: 'Soundboard', websocketPort: process.env.WEBSOCKET_PORT })
})

buildMenu(app);
registerCommands(app);
registerPlaysounds(app);

const envKeysForTwitchChannels = Object.keys(process.env).filter(key => key.startsWith('TWITCH_CHANNEL_NAME_'));
if (!!process.env.TWITCH_BOT_USERNAME
	&& process.env.TWITCH_BOT_OAUTH
	&& (envKeysForTwitchChannels && envKeysForTwitchChannels.length > 0)) {
	const channels: string[] = envKeysForTwitchChannels.reduce((previousValue: string[], currentValue: string) => {
		const actualChannelName = process.env[currentValue];
		if (actualChannelName && !previousValue.includes(actualChannelName)) {
			return [...previousValue, actualChannelName];
		}
		return [...previousValue];
	},  []);
  	const options = new TwitchOptions(process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_BOT_OAUTH, channels);
  	TwitchClient.create(options, Handlers);
  	const client = TwitchClient.getInstance();
  	client.connect();
  	const twitchReminderJob = new CronJob('*/10 * * * *', client.remindBound);
  	twitchReminderJob.start();
} else {
  	logger.warn('Unable to connect to Twitch, missing credentials (TWITCH_BOT_USERNAME, TWITCH_BOT_OAUTH, TWITCH_CHANNEL_NAME)');
}

const server = http.createServer(app);

export const serverVars = { server, app };
