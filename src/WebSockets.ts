import watersports from 'ws';
import server from '@server';
import { TwitchClient } from '@twitch';

import logger from '@shared/Logger';
import { ChatUserstate } from 'tmi.js';
import { IncomingMessage } from 'http';

const wss = new watersports.Server({ port: Number(process.env.WEBSOCKET_PORT || 3030) });

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

				wss.clients.forEach((client) => {
					if (client !== ws) {
						client.send(soundId);
					}
				})

				if (data.userstate.username) {
					const client = TwitchClient.getInstance();
					const responseMessage = `Command to send sound "${soundId}" successfully sent.`;
					client.whisper(data.userstate.username, responseMessage);
				}
			} else {
				return;
			}
		} catch (e) {
			logger.error(e);
		}
	});

	logger.info(`Client with IP ${req.socket.remoteAddress} connected.`);
});

export default server;