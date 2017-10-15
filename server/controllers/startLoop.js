/**
 * Module to create a loop to send new posts each n hours
 * @module controllers/updateLoop
 */
const cron = require('node-cron');
const newsletter = require('./newsletter');

/**
 * Send posts update each n hours
 *
 * @param {integer} hours - Define the interval in hours for each update
 */
module.exports = (hours) => {
  //cron.schedule('*/' + hours + ' * * * *', () => {
  cron.schedule('0 */' + hours + ' * * *', () => {
    newsletter();
  });
};
