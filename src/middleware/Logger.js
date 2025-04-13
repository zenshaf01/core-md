import morgan from 'morgan';
import { format } from 'date-fns';

// Add a timestamp to the log
morgan.token('timestamp', () => format(new Date(), 'yyyy-MM-dd HH:mm:ss'));

// Define the log format
const loggerFormat = ':timestamp :remote-addr :method :url :status :response-time ms - :res[content-length]';

// Create a logger middleware
const logger = morgan(loggerFormat);
export default logger;