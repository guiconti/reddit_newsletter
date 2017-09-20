/**
 * Module to send all subreddit newsletter to chats
 * @module controllers/newsletter
 */
const _ = require('underscore');
const request = require('request');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');
const getPosts = require('./getPosts');

/**
 * Send all subreddit newletter to chat id
 *
 * @param {string} subreddit - Subreddit name
 * @param {integer} chatId - Telegram chat id TODO: Encapsulate this in an api keyso o timer seja inserido
 * @throws {Error} - Rejects the promise with an error message
 */
module.exports = (subreddit, chatId) => {

  if(!validation.isValidString(subreddit)) return logger.error(constants.messages.error.INVALID_SUBREDDIT);
  if(!validation.isValidNumber(parseInt(chatId))) return logger.error(constants.messages.error.INVALID_CHATID);

  getPosts(subreddit).then((newPosts) => {
    let postsToSend = getNewPosts(subreddit, newPosts);
    return sendPosts(subreddit, chatId, postsToSend);
  }, (err) => {
    return logger.error(err);
  });
};

function getNewPosts(subreddit, newPosts) {
  if (!savedPosts[subreddit].posts){
    return newPosts;
  }
  let postsToSend = [];
  try {
    newPosts.forEach((post) => {
      if (savedPosts[subreddit].posts.findIndex((savedPost) => {
        return savedPost.id == post.id;
      }) == -1){
        postsToSend.push(post);
      }
    });
    return postsToSend;
  } catch (err) {
    logger.error(err);
    return;
  }

}

function sendPosts(subreddit, chatId, unformattedPosts) {
  let requestInfo = {
    chatId: chatId
  };
  if (unformattedPosts.length == 0){
    requestInfo.message = constants.messages.info.NO_NEW_POSTS;
    return sendTelegramMessage(constants.urls.GIBOT, requestInfo);
  }

  requestInfo.message = constants.messages.info.NEW_POSTS + subreddit + '\n\n';
  sendTelegramMessage(constants.urls.GIBOT, requestInfo);

  unformattedPosts.forEach((post) => {
    requestInfo.message = post.title + '\n' + post.url + '\n\n';
    sendTelegramMessage(constants.urls.GIBOT, requestInfo);
  });
}

function sendTelegramMessage(url, requestInfo) {
  request.post({url: url, form: requestInfo}, (err, httpResponse, html)=>{});
};
