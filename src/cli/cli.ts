// tslint:disable:no-expression-statement no-console
import chalk from 'chalk';
import { checkArgs } from './args';
import { inquire } from './inquire';
import { getInferredOptions, LiveTasks } from './tasks';
import { typescriptStarter } from './typescript-starter';
import { getIntro, TypescriptStarterUserOptions } from './utils';

(async () => {
  const cliOptions = await checkArgs(); // collect infos from cli
  const userOptions = cliOptions.projectName // collect info from cli prompt questions
    ? (cliOptions as TypescriptStarterUserOptions)
    : {
        ...(await (async () => {
          console.log(getIntro(process.stdout.columns));
          return inquire();
        })()),
        ...cliOptions // merge in cliOptions.install
      };
  const inferredOptions = await getInferredOptions(); // 通过clone 的项目信息, 推断出一些信息 name, email etc
  return typescriptStarter({ ...inferredOptions, ...userOptions }, LiveTasks); // run actual jobs
})().catch((err: Error) => {
  console.error(`
  ${chalk.red(err.message)}
`);
  process.exit(1);
});
