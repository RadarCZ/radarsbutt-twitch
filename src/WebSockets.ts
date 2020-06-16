import watersports from 'ws';
import { serverVars } from '@server';
import { TwitchClient } from '@twitch';

import logger from '@shared/Logger';
import { ChatUserstate } from 'tmi.js';
import { IncomingMessage } from 'http';

export const wss = new watersports.Server({ server: serverVars.server, path: '/websocket' });

logger.info(`Watersports Server started on port: ${process.env.PORT || 3000}`);

const soundCooldowns: Record<string, Date> = {};
const queue: string[] = [];
let isPlaying = false;

export type IncomingTwitchWatersportMessage = {
	message: string;
	userstate: ChatUserstate;
};

wss.on('connection', (ws: watersports, req: IncomingMessage) => {
	ws.on('message', (message: string) => {
		try {
			const data: IncomingTwitchWatersportMessage = JSON.parse(message);

			if (data.message.startsWith('!playsound ')) {
				const soundId = data.message.split(' ')[1];
				if (!soundId) {
					return;
				}

				const availableSoundNames: string[] = serverVars.app.locals.soundNames;
				const soundIsAvailable: boolean = availableSoundNames && availableSoundNames.includes(soundId);

				if(!soundIsAvailable) {
					const error = `Sound "${soundId}" is not available (yet). Check http://radarsbutt.radarsoft.cz/playsounds for the list of supported playsounds.`;
					if (data.userstate.username) {
						const client = TwitchClient.getInstance();
						client.whisper(data.userstate.username, error);
					}
					logger.info(error);
					return;
				}

				const shouldBeAvailableDate = new Date(soundCooldowns[soundId]);
				logger.info(`The sound "${soundId}" was last played at '${shouldBeAvailableDate}'.`)
				if (shouldBeAvailableDate.valueOf()) {
					shouldBeAvailableDate.setMinutes(shouldBeAvailableDate.getMinutes() + Number(process.env.SOUNDBOARD_DEFAULT_COOLDOWN));
				}

				const currentDate = new Date();
				const responseMessage = `Command to send sound "${soundId}" successfully sent.`;
				if (shouldBeAvailableDate.valueOf() && currentDate < shouldBeAvailableDate) {
					logger.info(`"${soundId}" on cooldown, next will be available at ${shouldBeAvailableDate.toLocaleString()}`);
					if (data.userstate.username) {
						const minuteDifference = shouldBeAvailableDate.getMinutes() - currentDate.getMinutes();
						const client = TwitchClient.getInstance();
						const actualMessage = `${responseMessage} Unfortunately, the sound is on cooldown, it will be available in ${minuteDifference} minute${minuteDifference === 1 ? '' : 's'}`;
						client.whisper(data.userstate.username, actualMessage);
					}
					return;
				} else {
					logger.info(`Adding a cooldown for the sound "${soundId}"`)
					soundCooldowns[soundId] = new Date();
				}

				if (!isPlaying) {
					isPlaying = true;
					setTimeout(() => {
						logger.info(`Sending immediately: ${soundId}`);
						wss.clients.forEach((client) => {
							if (client !== ws) {
								client.send(soundId);
							}
						});
					}, 5000);
				} else {
					queue.push(soundId);
					logger.info(`Inserted "${soundId}" into the queue; whole queue is now ${JSON.stringify(queue)}`);
				}

				if (data.userstate.username) {
					const client = TwitchClient.getInstance();
					client.whisper(data.userstate.username, responseMessage);
				}
			} else if (data.message.startsWith('GimmeNextYouFuck')) {
				const soundId = queue.shift();
				logger.info(`Next sound in queue is "${soundId}"`)
				if (soundId) {
					setTimeout(() => {
						logger.info(`Sending next from queue: ${soundId}`);
						wss.clients.forEach((client) => {
							client.send(soundId);
						});
					}, 5000);
				} else {
					isPlaying = false;
				}
			} else if (data.message === 'BOOP') {
				logger.info('BOOP received, sending BAP to all clients.')
				wss.clients.forEach((client) => {
					client.send('BAP');
				});
			} else {
				return;
			}
		} catch (e) {
			logger.error(e);
		}
	});

	logger.info(`Client with IP ${req.socket.remoteAddress} connected.`);
});

const { server } = serverVars;
export default server;