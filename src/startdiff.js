import { program } from 'commander';

program
    .name('genDiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .option('-f, --format <type>', 'output format')
    .parse(process.argv);

program.parse();

const options = program.opts();
if (options.version) console.log(version);
if (options.help) console.log('help is not help');
