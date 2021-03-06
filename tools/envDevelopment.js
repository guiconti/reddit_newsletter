"use strict";

/* eslint-disable no-console */

const fs = require('fs'),
    path = require('path'),
    readline = require('readline');

const filename = '.env',
    file = path.resolve(__dirname, '../' + filename);

/**
 * Constant that will contain the .env variables
 * If you want a new environment variable on build add here
 */ 
const envVars = {
    NODE_ENV: 'development',
    PORT: 3301,
    HOST: 'http://localhost:3301',
    PASSWORD_ENCRYPTATION: 'DEV_ENCRYPTATION_SIMPLE_KEY',
    USER_DATA_ENCRYPTATION: 'DEV_USER_DATA_ENCRYPTATION',
    TOKEN_ENCRYPTATION: 'DEV_TOKEN_ENCRYPTATION',
    GIBOT_URL: 'http://localhost:3101/telegram/message/chat',
    DB_HOST: 'mongodb://localhost:27017/Reddit_Newsletter'
};

console.log('checking file ' + filename);
/**
 * Check the stat of the file .env
 * Calling the callback onStat
 */
fs.stat(file, onStat);


/**
 * Check if the .env already exists. If it does read it
 * If it don't create it with the envVars
 * 
 * @param {object} err 
 * @param {object} stats
 */
function onStat(err, stats) {
  
    if (!err && stats.isFile()) {
        readFile();
    } else {
        console.log(filename + ' does not exist, creating it.');
        createFile();
  }
}

/**
 * Create a new file using the name filename
 * Used if the .env already doest not exists
 */
function createFile() {
    fs.writeFile(file, '', function(err) {
        if (err) return console.error(err);

        readFile();
  });
}

/**
 * Read the .env file
 */
function readFile() {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(file)
    });

    lineReader.on('line', parseLine);
    lineReader.on('close', completeFile);
}

function parseLine(line) {
    let arr = line.split('=');
    let key = arr[0];

    if(!envVars[key]) {
        if (arr[1]) {
            envVars[arr[0]] = arr[1];
        }
    }
}

/**
 * Write the .env file
 */
function completeFile() {
    let writeStream = fs.createWriteStream(file);

    for(let key in envVars) {
        let envVar = envVars[key];
        let newLine = key + '=' + envVar;
        console.log('writing to file: ' + newLine);
        writeStream.write(newLine + '\n');
    }

    writeStream.end('');
    console.log(filename + ' is ok!');
}