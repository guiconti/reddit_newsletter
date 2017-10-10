/**
 * Module to create a loop to send new posts each n hours
 * @module controllers/updateLoop
 */
const cron = require('node-cron');
const newsletter = require('./newsletter');

/**
 * Send posts update each n hours
 *
 * @param {string} subreddit - Subreddit name
 * @param {integer} chatId - Telegram chat id
 * @param {integer} hours - Define the interval in hours for each update
 */
module.exports = (subreddit, chatId, hours) => {
  //cron.schedule('*/' + hours + ' * * * *', () => {
  cron.schedule('0 */' + hours + ' * * *', () => {
    newsletter(subreddit, chatId);
  });
};
