/**
 * Module to send all posts to a telegram chat
 * @module controllers/sendPosts
 */

const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const sendTelegramMessage = require('./sendTelegramMessage');

/**
 * Send all posts to a telegram chat
 *
 * @param {string} subreddit - Subreddit name
 * @param {integer} chatId - Telegram chat id TODO: Encapsulate this in an api keyso o timer seja inserido
 * @param {object[]} unformattedPosts - All posts that will be sent to telegram
 * @throws {Error} - Rejects the promise with an error message
 */

module.exports = (subreddit, chatId, unformattedPosts) => {
  return new Promise((resolve, reject) => {
    let requestInfo = {
      chatId: chatId
    };
    if (unformattedPosts.length == 0){
      requestInfo.message = constants.messages.info.NO_NEW_POSTS;
      sendTelegramMessage(constants.urls.GIBOT, requestInfo);
      return resolve();
    }
  
    requestInfo.message = constants.messages.info.NEW_POSTS + subreddit + '\n\n';
    sendTelegramMessage(constants.urls.GIBOT, requestInfo);
  
    try{
      unformattedPosts.forEach((post) => {
        requestInfo.message = post.title + '\n' + post.url + '\n\n';
        sendTelegramMessage(constants.urls.GIBOT, requestInfo);
      });
      return resolve();
    } catch(err) {
      logger.error(err);
      return reject(err);
    }
  });
}
  