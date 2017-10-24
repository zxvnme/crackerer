const filesystem = require('fs');
const steamapi = require('steam-web');
const readline = require('readline');
const config = require('./config.json');
const pack = require('./package.json');
const steam = new steamapi({ apiKey: config.apikey, format: 'json' });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let dictionary;
let dictionary_interval;
let dictionary_path;
rl.setPrompt('>> ');
rl.prompt();
rl.on('line', (input) => {
    let args = input.split(' ');
    switch (args[0]) {
        case 'help':
            console.log('\n interval <int>  Sets the interval. Default is 600ms.\n path <path>  Sets path to your dictionary.\n author  Shows author of the app.\n clear  Clears the console.\n exit  Quits the app.\n start  Starts the bruteforce.\n');
            rl.prompt();
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'interval':
            if (!args[1]) {
                console.log('    Invalid syntax! Usage:  interval 600  (600 is recommended interval.)');
                return rl.prompt();
            }
            dictionary_interval = args[1];
            console.log('    Set interval to: ' + args[1] + ' ms');
            rl.prompt();
            break;
        case 'path':
            if (!args[1]) {
                console.log('    Invalid syntax! Usage:  path ./dictionary.txt');
                return rl.prompt();
            }
            dictionary_path = args[1];
            console.log('    Set dictionary path to: ' + args[1]);
            rl.prompt();
            break;
        case 'author':
            console.log('\nzxvnme\ngithub.com/zxvnme/crackerer\n' + pack.version + '\n');
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
            if (dictionary_path != null) {
                crackerer();
                rl.prompt();
            } else {
                console.log('    Cannot start because of no path specified :(');
                return rl.prompt();
            }
            break;
        default:
            rl.prompt();
            break;
    }
});

function crackerer() {
    filesystem.readFile(dictionary_path, (err, data) => {
        dictionary = data.toString().split('\r\n');
        for (let index = 0; index < dictionary.length; ++index) {
            setTimeout((i) => {
                let value = dictionary[index];
                steam.resolveVanityURL({
                    vanityurl: value.toString(),
                    callback: function (err, data) {
                        console.log(dictionary[index] + '  ' + data.response.steamid);
                    }
                })
            }, ((dictionary_interval) ? dictionary_interval : 600) * index)
        };
    });
}



