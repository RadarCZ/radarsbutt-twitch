import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response } from 'express';
import 'express-async-errors';
import { registerHelpers, buildMenu, registerCommands } from '@shared/functions';
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

buildMenu(app);
registerCommands(app);

if (!!process.env.TWITCH_BOT_USERNAME
	&& process.env.TWITCH_BOT_OAUTH
	&& process.env.TWITCH_CHANNEL_NAME) {
  const options = new TwitchOptions(process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_BOT_OAUTH, process.env.TWITCH_CHANNEL_NAME);
  TwitchClient.create(options, Handlers);
  TwitchClient.getInstance().connect();
} else {
  logger.warn('Unable to connect to Twitch, missing credentials (TWITCH_BOT_USERNAME, TWITCH_BOT_OAUTH, TWITCH_CHANNEL_NAME)');
}

export default app;
