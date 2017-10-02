/**
 * Module to send all subreddit newsletter to chats
 * @module controllers/newsletter
 */
const _ = require('underscore');
const SubredditModel = require('../models/Subreddit');
const request = require('request');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');
const getPosts = require('./getPosts');
const sendPosts = require('./sendPosts');

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
    sendPosts(subreddit, chatId, postsToSend)
      .then(() => {
        return;
      }, (err) => {
        logger.error(err);
        return;
      });
  }, (err) => {
    return logger.error(err);
  });
};

function getNewPosts(subreddit, newPosts) {
  SubredditModel.findOne({name: subreddit}, (err, subredditInfo) => {
    if (!subredditInfo.posts || subredditInfo.posts.length == 0){
      subredditInfo.posts = newPosts;
    }
    let postsToSend = [];
    try {
      newPosts.forEach((post) => {
        if (subredditInfo.posts.findIndex((savedPost) => {
          return savedPost.id == post.id;
        }) == -1){
          postsToSend.push(post);
        }
      });
      subredditInfo.posts = postsToSend;
      subredditInfo.save((err) => {
        if (err) {
          logger.error(err);
          return postsToSend;
        }
        return subredditInfo.posts;
      });
    } catch (err) {
      logger.error(err);
      return;
    }
  });
}
