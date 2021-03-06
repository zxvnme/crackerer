const filesystem = require('fs');
const steamapi = require('steam-web');
const readline = require('readline');
const config = require('./config.json');
const pack = require('./package.json');
const steam = new steamapi({ apiKey: config.apikey, format: 'json' });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

/* Definitions */
let space = '   ';

/* Declarations */
let args;
let output;
let mode;
let dictionary;
let dictionary_interval;
let dictionary_path;

/**
 * Prints proper command usage to console with 'Invalid syntax!' prefix.
 * @constructor
 * @param {string} pusg - Proper usage.
 */
function syntaxError(pusg) {
    return console.log(space + 'Invalid syntax! Usage: ' + pusg);
};

/**
 * Logs the message to console and file output.
 * @constructor
 * @param {string} message - Message to be logged.
 */
function log(message) {
    output = output + '\n' + message;
    console.log(message);
};

/**
 * Saves cracker output to text file.
 */
function saveCrackerer() {
    let statistics;
    filesystem.stat('./_logs', (err, stats) => {
        if (!err) {
            filesystem.writeFile('./_logs/output.txt', output, (err) => {
                console.log(space + 'Saved!');
                rl.prompt();
            });
        } else if (err.code === 'ENOENT') {
            filesystem.mkdir('./_logs/');
            filesystem.writeFile('./_logs/output.txt', output, (err) => {
                console.log(space + 'Saved!');
                rl.prompt();
            });
        }
    });
};

/**
 * Starts crackerer.
 */
function startCrackerer() {
    if (mode === 'profile') {
        filesystem.readFile(dictionary_path, (err, data) => {
            dictionary = data.toString().split('\r\n');
            for (let index = 0; index < dictionary.length; ++index) {
                setTimeout(() => {
                    let value = dictionary[index];
                    steam.resolveVanityURL({
                        vanityurl: value,
                        callback: (err, data) => {
                            log(dictionary[index] + '  ' + ((!data.response.steamid) ? space + 'Not claimed!' : data.response.steamid));
                            rl.prompt();
                        }
                    })
                }, ((dictionary_interval) ? dictionary_interval : 600) * index)
            };
        });
    } else if (mode === 'group') {
        // TODO
    }
};
rl.setPrompt(config.prompt);
rl.prompt();
rl.on('line', (input) => {
    args = input.split(' ');
    switch (args[0]) {
        case 'help':
            console.log('\n save  Saves output to the text file.\n check <string>  Checks single URL specified in argument. \n interval <int>  Sets the interval. Default is 600ms.\n path <path>  Sets path to your dictionary.\n mode <profile/group>  Sets cracking mode.\n author  Shows author of the app.\n clear  Clears the console.\n exit  Quits the app.\n start  Starts the bruteforce.\n');
            rl.prompt();
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'interval':
            if (!args[1]) {
                syntaxError('interval 600  (600 is recommended interval.)');
                return rl.prompt();
            }
            dictionary_interval = args[1];
            console.log(space + 'Set interval to: ' + args[1] + ' ms');
            rl.prompt();
            break;
        case 'path':
            if (!args[1]) {
                syntaxError('path ./dictionary.txt');
                return rl.prompt();
            }
            dictionary_path = args[1];
            console.log(space + 'Set dictionary path to: ' + args[1]);
            rl.prompt();
            break;
        case 'mode':
            if (!args[1]) {
                syntaxError('mode <profile/group>');
                return rl.prompt();
            }
            mode = args[1];
            console.log(space + 'Set mode to: ' + args[1]);
            rl.prompt();
            break;
        case 'author':
            console.log('\n zxvnme\n github.com/zxvnme/crackerer\n' + ' ' + pack.version + '\n');
            rl.prompt();
            break;
        case 'clear':
            let lines = process.stdout.getWindowSize()[1];
            for (let i = 0; i < lines; i++) {
                console.log('\r\n');
            };
            rl.prompt();
            break;
        case 'start':
            if (dictionary_path != null && mode != null) {
                rl.prompt();
                startCrackerer();
            } else {
                console.log(space + 'Cannot start because of no path or cracking mode specified :(');
                return rl.prompt();
            }
            break;
        case 'check':
            if (!args[1]) {
                syntaxError('check <name>')
                return rl.prompt();
            }
            steam.resolveVanityURL({
                vanityurl: args[1],
                callback: (err, data) => {
                    log(args[1] + ' ' + ((!data.response.steamid) ? space + 'Not claimed!' : data.response.steamid));
                    rl.prompt();
                }
            });
            break;
        case 'save':
            saveCrackerer();
            rl.prompt();
            break;
        default:
            rl.prompt();
            break;
    }
});