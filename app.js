const steamapi = require('steam-web');
const readline = require('readline');
const config = require('./config.json');
const package = require('./package.json');
const fs = require('fs');
const s = new steamapi({ apiKey: config.apikey, format: 'json' });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let dictionary;
let dictionary_int;
let dictionary_path;
rl.setPrompt('>> ');
rl.prompt();
rl.on('line', (input) => {
    let args = input.split(' ');
    switch (args[0]) {
        case 'interval':
            if (!args[1]) return console.log('    Too few arguments.')
            dictionary_int = args[1];
            console.log('    Set interval to: ' + args[1] + ' ms');
            rl.prompt();
            break;
        case 'path':
            if (!args[1]) return console.log('    Too few arguments.')
            dictionary_path = args[1];
            console.log('    Set dictionary path to: ' + args[1]);
            rl.prompt();
            break;
        case 'author':
            console.log('\nzxvnme\ngithub.com/zxvnme/crackerer\n' + package.version +'\n');
            rl.prompt();
            break;
        case 'clear':
            console.log('\033[2J');
            rl.prompt();
            break;
        case 'start':
            if (dictionary_path != null && dictionary_int != null) {
                crackerer();
                rl.prompt();
            } else {
                console.log('    Cannot start because of no path/interval specified :(');
            }
            break;
        default:
            rl.prompt();
            break;
    }
});

function crackerer() {
    fs.readFile(dictionary_path, (err, data) => {
        dictionary = data.toString().split('\r\n');
        for (let index = 0; index < dictionary.length; ++index) {
            setTimeout((i) => {
                let value = dictionary[index];
                s.resolveVanityURL({
                    vanityurl: value.toString(),
                    callback: function (err, data) {
                        console.log(dictionary[index] + '  ' + data.response.steamid);
                    }
                })
            }, dictionary_int * index)
        };
    });
}



