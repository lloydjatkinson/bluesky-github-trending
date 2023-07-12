import {
    getLogger as denoGetLogger,
    handlers,
    setup,
} from 'https://deno.land/std@0.193.0/log/mod.ts';
import { format } from 'https://deno.land/std@0.193.0/datetime/mod.ts';

/**
 * The logger type. Each component of the bot has it's own type.
 */
type LoggerType =
    | 'Configuration'
    | 'Main'
    | 'Scraper'
    | 'Filter'
    | 'Agent'
    | 'Scheduler';

/**
 * Configures the native Deno logger.
 */
export const setupLogging = async () => {
    await setup({
        handlers: {
            console: new handlers.ConsoleHandler('DEBUG', {
                formatter: (logRecord) => {
                    handlers.BaseHandler;
                    let msg = `${
                        format(logRecord.datetime, 'dd-MM-yyyy hh:mm a')
                    } [${logRecord.levelName}] [${logRecord.loggerName}] - ${logRecord.msg}`;

                    logRecord.args.forEach((arg, index) => {
                        msg += `, arg${index}: ${arg}`;
                    });

                    return msg;
                },
            }),
            file: new handlers.RotatingFileHandler('DEBUG', {
                filename: './logs.log',
                maxBytes: 1048576,
                maxBackupCount: 10,
                formatter: (logRecord) => {
                    let msg = `${
                        format(logRecord.datetime, 'dd-MM-yyyy hh:mm a')
                    } [${logRecord.levelName}] [${logRecord.loggerName}] - ${logRecord.msg}`;

                    logRecord.args.forEach((arg, index) => {
                        msg += `, arg${index}: ${arg}`;
                    });

                    return msg;
                },
            }),
        },
        loggers: {
            'Main': {
                level: 'DEBUG',
                handlers: ['console', 'file'],
            },
            'Configuration': {
                level: 'DEBUG',
                handlers: ['console', 'file'],
            },
            'Scheduler': {
                level: 'DEBUG',
                handlers: ['console', 'file'],
            },
            'Scraper': {
                level: 'DEBUG',
                handlers: ['console', 'file'],
            },
        },
    });
};

/**
 * A minimal abstraction around the native Deno logger which simply constrains
 * avaliable logger names.
 * @param {LoggerType} type The logger type to get.
 * @returns {Logger | undefined} The configured logger.
 */
export const getLogger = (type: LoggerType) => denoGetLogger(type);

// /**
//  * A minimal abstraction around the native Deno logger which simply constrains
//  * avaliable logger names and provides a mechanism for logging execution time.
//  * @param {LoggerType} type The logger type to get.
//  * @returns {Logger | undefined} The configured logger.
//  */
// export const logTime = async <T>(type: LoggerType, message: string, action: () => void): Promise<T> => {
//     const startTime = new Date();
//     await action();
//     const endTime = new Date();

//     const executionTime = endTime.getTime() - startTime.getTime();
//     const logger: Logger = getLogger(type);
//     logger.info(`${executionTime}ms ${message}`);
// };

// export class DiffLogger extends ConsoleHandler {
//     override
// }
