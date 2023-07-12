const { Command } = require(`commander`);
const program = new Command();

program
    .name('genDiff')
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    // .option('-V, --version');
    // .option('-h --help');

program.parse();

const options = program.opts();
if (options.version) console.log(version);
if (options.help) console.log('help is not help');