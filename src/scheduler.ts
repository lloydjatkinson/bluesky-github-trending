import { format } from 'https://deno.land/std@0.193.0/datetime/mod.ts';
import { Logger } from 'https://deno.land/std@0.193.0/log/logger.ts';
import { Cron } from 'https://deno.land/x/croner@6.0.3/dist/croner.js';

type Job = Readonly<{
    pattern: string;
    name: string;
    logger: Logger;
    action: () => Promise<void>;
}>;

export const scheduleJob = ({ pattern, name, logger, action }: Job) => {
    try {
        const logWrappedAction = async () => {
            logger.debug(`Running job "${name}"`);
            await action();
            logger.debug(`Finished job "${name}"`);
        };
        const created = new Cron(pattern, { name }, logWrappedAction);
        const nextRunsFormatted = created.nextRuns(3).map((date) =>
            format(
                date,
                'dd-MM-yyyy hh:mm a',
            )
        ).join(', ');
        logger.info(
            `Scheduled job "${name}" with next three runs at ${nextRunsFormatted}`,
        );
    } catch (error) {
        logger.error(`Unable to schedule post job "${name}". ${error}`);
    }
};
