/**
 * Module to send all subreddit newsletter to chats
 * @module controllers/newsletter
 */
const _ = require('underscore');
const mongoose = require('mongoose');
const SubredditModel = mongoose.model('Subreddit');
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
module.exports = () => {
  SubredditModel.find({}, 'name subscriptions')
    .then((subreddits) => {
      subreddits.forEach((subreddit) => {
        getPosts(subreddit.name)
        .then((newPosts) => {
          getNewPosts(subreddit, newPosts)
            .then((postsToSend) => {
              subreddit.subscriptions.forEach((subscription) => {
                sendPosts(subreddit.name, subscription, postsToSend)
                .then(() => {
                  return;
                })
                .catch((err) => {
                  logger.error(err);
                  return;
                });
              })
            })
            .catch((err) => {
              logger.error(err);
            });
        })
        .catch((err) => {
          return logger.critical(err);
        });
      });
    })
    .catch((err) => {
      return logger.critical(err);
    });
};

function getNewPosts(subredditInfo, newPosts) {
  return new Promise((resolve, reject) => {
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
      subredditInfo.posts.push(postsToSend);
      subredditInfo.save((err) => {
        if (err) {
          logger.error(err);
        }
        return resolve(postsToSend);
      });
    } catch (err) {
      logger.error(err);
      return reject(err);
    }
  });
}
