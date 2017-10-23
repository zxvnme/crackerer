## crackerer
### What is it?
Crackerer is simple bruteforce-based application written in node.js that allows you to check for unique steam names.
### How to use it?
It's very simple. All you need to do is install `steam-web` package from node package manager by typing `npm i steam-web --save` in your terminal, request for steam web api key [here](https://steamcommunity.com/dev) and paste it into your `config.json`. After doing that, you should launch the app. Bruteforce dictionary format is words separated by new line.

| command  | argument | explaination                                 |
|----------|----------|----------------------------------------------|
| interval | int      | Time, that app will wait before each check.  |
| path     | string   | Path to our bruteforce dictionary.           |
| author   | none     | Prints info abou author to console.          |
| clear    | none     | Clears the console.                          |
| start    | none     | Starts the bruteforce.                       |