/**
 * Module to check all subscriptions for a chat id
 * @module controllers/sendTelegramMessage
 */
const request = require('request');

/**
 * Send a message to a telegram chat
 * @param {string} url - Url for the send message api
 * @param {object} requestInfo - Message and telegram chat id info
 */

module.exports = (url, requestInfo) => {
  request.post({url: url, form: requestInfo}, (err, httpResponse, html)=>{});
};