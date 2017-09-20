/**
 * API Module for Reddit front page fetch
 * @module controllers/reddit
 */

const underscore = require('underscore');
const request = require('request');
const logger = require('../../tools/logger');
const validation = require('../utils/validation');
const constants = require('../utils/constants');

/**
 * Fetch all posts from first page
 *
 * @param {string} subreddit - Subreddit name to fetch posts from
 * @param {express.app.res} res - Posts from subreddit or an error message
 */

module.exports = (subreddit) => {
  return new Promise((resolve, reject) => {
    if (!validation.isValidString(subreddit)) return reject({
      error: constants.messages.error.NOT_VALID_SUBREDDIT
    });
  
    request.get({url: constants.urls.REDDIT_PREFIX + subreddit + constants.urls.REDDIT_SUFFIX}, function(err, httpResponse, html) {
      if (err) {
        return reject({
          error: constants.messages.error.NON_EXISTENT_SUBREDDIT
        });
      }
      try {
        let subredditInfo = JSON.parse(html);
        if (subredditInfo.error) return reject({
          error: constants.messages.error.NON_EXISTENT_SUBREDDIT
        });
        if (subredditInfo.data.children.length == 0){
          return reject({
            error: constants.messages.error.NON_EXISTENT_SUBREDDIT
          });
        }
        return resolve({
          msg: formatPosts(subredditInfo.data.children)
        });
      } catch (e) {
        logger.error(e);
        return reject({
          error: constants.messages.error.NON_EXISTENT_SUBREDDIT
        });
      } 
    });
  });
};

function formatPosts(unformattedPosts) {
  let formattedPosts = [];
  unformattedPosts.forEach((post) => {
    let newPost = {
      id: post.data.id,
      title: post.data.title,
      url: post.data.url
    };
    formattedPosts.push(newPost);
  });
  return(formattedPosts);
};