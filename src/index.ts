import './LoadEnv'; // Must be the first import
import server from './WebSockets';
import logger from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 3000);

server.listen(port, () => {
	logger.info('Express server started on port: ' + port);
});
