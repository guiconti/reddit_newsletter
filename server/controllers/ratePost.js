/**
 * Module to rate a sent post
 * @module controllers/ratePost
 */
const _ = require('underscore');
const mongoose = require('mongoose');
const SubredditModel = mongoose.model('Subreddit');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');

/**
 * Rate one post
 *
 * @param {string} req.body.subreddit - Subreddit name
 * @param {string} req.body.postId - Post id that receive the feedback
 * @param {integer} req.body.score - Score sent from user
 * @throws {Error} - Rejects the promise with an error message
 */
module.exports = (req, res) => {
  let body = _.pick(req.body, 'subreddit', 'postId', 'score');
  if(!validation.isValidString(body.subreddit)) return res.status(400).json({
    error: constants.messages.error.INVALID_SUBREDDIT
  });
  if(!validation.isValidString(body.postId)) return res.status(400).json({
    error: constants.messages.error.INVALID_POST_ID
  });
  if(!validation.isValidNumber(parseInt(body.score))) return res.status(400).json({
    error: constants.messages.error.INVALID_SCORE
  });
  body.subreddit = body.subreddit.trim().toLowerCase();
  body.postId = body.postId.trim();
  body.score = parseInt(body.score);
  SubredditModel.findOne({name: body.subreddit})
    .then((subreddit) => {
      if (!subreddit){
        return res.status(404).json({
          error: constants.messages.error.NON_EXISTENT_SUBREDDIT
        })
      }
      let postIndex = subreddit.posts.findIndex((post) => {
        return post.id == body.postId
      });
      if (postIndex === -1){
        return res.status(404).json({
          error: constants.messages.error.NON_EXISTENT_POST
        });
      }
      subreddit.posts[postIndex].internalScore += body.score;
      subreddit.save((err) => {
        if(err) {
          logger.error(err);
          return res.status(500).json({
            error: constants.messages.error.UNEXPECTED
          });
        }
        return res.status(200).json({
          error: constants.messages.info.FEEDBACK_REGISTERED
        });
      });
    })
    .catch((err) => {
      logger.error(err);
      console.log(err);
      res.status(500).json({
        error: constants.messages.error.UNEXPECTED
      });
    });
};
