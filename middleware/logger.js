const { readFile } = require("fs");
const chalk = require("chalk");
const { Console } = require("console");

class Logger extends Console {
    constructor() {
        super(process.stdout, process.stderr);
    }

    logRequest(req, res, next) {
        readFile("./logs/access.log", (err, data) => {
    

            next();
        });
    };

    info(input, type = "INFO") {
        if(type === "BLANK") {
            return this.log(chalk.hidden("-"))
        }
        const mess = chalk.bold.cyan(this.date() + " - [ "+type+" ] => ") + input;
        this.log(mess);
    };

    
    date(msTimeStamp = new Date().getTime()) {
        let date = new Date(msTimeStamp);

        var minutes = date.getMinutes();
        if(minutes.toString().length === 1) minutes = `0${minutes}`;

        var seconds = date.getSeconds();
        if(seconds.toString().length === 1) seconds = `0${seconds}`;

        return `[ ${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()} - ${date.getHours()}:${minutes}:${seconds} ]`;
    };
};

module.exports = Logger;