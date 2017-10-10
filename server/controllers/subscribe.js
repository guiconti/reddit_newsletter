/**
 * Module to subscribe a chat id to a subreddit
 * @module controllers/subscribe
 */
const _ = require('underscore');
const mongoose = require('mongoose');
const SubredditModel = mongoose.model('Subreddit');
const cron = require('node-cron');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');
const getPosts = require('./getPosts');
const newsletter = require('./newsletter');
const sendPosts = require('./sendPosts');
const sendTelegramMessage = require('./sendTelegramMessage');

/**
 * Subscribe an endpoint to a new subreddit
 *
 * @param {string} req.body.subreddit - Subreddit name
 * @param {integer} req.body.chatId - Telegram chat id TODO: Encapsulate this in an api keyso o timer seja inserido
 * @throws {Error} - Rejects the promise with an error message
 */
module.exports = (req, res) => {

  let body = _.pick(req.body, 'subreddit', 'chatId');
  if(!validation.isValidString(body.subreddit)) return res.status(400).json({
    error: constants.messages.error.INVALID_SUBREDDIT
  });
  if(!validation.isValidNumber(parseInt(body.chatId))) return res.status(400).json({
    error: constants.messages.error.INVALID_CHATID
  });

  body.subreddit = body.subreddit.toLowerCase().trim();
  body.chatId = parseInt(body.chatId);
  SubredditModel.findOne({name: body.subreddit})
    .then((subreddit) => {
      if (!subreddit){
        let newSubreddit = {
          name: body.subreddit,
          subscriptions: [],
          posts: []
        };
        subreddit = new SubredditModel(newSubreddit);
      } else if (subreddit.subscriptions.includes(body.chatId)){
        let requestInfo = {
          chatId: body.chatId,
          message: constants.messages.error.ALREADY_SUBSCRIBED
        };
        sendTelegramMessage(constants.urls.GIBOT, requestInfo);
        return res.status(400).json({
          err: constants.messages.error.ALREADY_SUBSCRIBED
        });
      }
      try {
        subreddit.subscriptions.push(parseInt(body.chatId));
        getPosts(subreddit.name)
          .then((formattedPosts) => {
            formattedPosts.forEach((formattedPost) => {
              if (subreddit.posts.findIndex((savedPost) => {
                return savedPost.id == formattedPost.id;
              }) == -1){
                subreddit.posts.push(formattedPost);
              }
            });
  
            newSubscription(subreddit.name, parseInt(body.chatId), constants.values.HOURS_TO_UPDATE);
            sendPosts(subreddit.name, parseInt(body.chatId), formattedPosts);
            subreddit.save((err, createdSubreddit) => {
              if (err) {
                return res.status(400).json(err);
              }
              return res.status(200).json();
            });
          })
          .catch((err) => {
            logger.error(err);
            return res.status(500).json(err);
          });
      } catch (err) {
        logger.error(err);
        return res.status(500).json({
          error: constants.messages.error.UNEXPECTED
        });
      }
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).json({
        error: constants.messages.error.UNEXPECTED
      });
    });
};

function newSubscription(subreddit, chatId, hours){
  //cron.schedule('*/' + hours + ' * * * *', () => {
  cron.schedule('0 */' + hours + ' * * *', () => {
    newsletter(subreddit, chatId);
  });
}
