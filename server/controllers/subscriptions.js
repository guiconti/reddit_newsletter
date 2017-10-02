/**
 * Module to check all subscriptions for a chat id
 * @module controllers/subscriptions
 */
const _ = require('underscore');
const mongoose = require('mongoose');
const SubredditModel = mongoose.model('Subreddit');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');
const sendTelegramMessage = require('./sendTelegramMessage');

/**
 * Check subscriptions of a chat id
 *
 * @param {integer} req.params.chatId - Telegram chat id
 * @throws {Error} - Return a json with an error message
 */
module.exports = (req, res) => {
  let params = _.pick(req.params, 'chatId');
  if (!validation.isValidNumber(parseInt(params.chatId))) return res.status(400).json({
    error: constants.messages.error.INVALID_CHATID
  });
  params.chatId = parseInt(params.chatId);

  try {
    let subscriptions = [];
    SubredditModel.find({subscriptions: params.chatId}, (err, subredditSubscriptions) => {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          error: constants.messages.error.UNEXPECTED
        });
      }
      let requestInfo = {
        chatId: params.chatId
      };
      if (subredditSubscriptions.length == 0){
        requestInfo.message = constants.messages.info.NO_SUBSCRIPTIONS;
      } else {
        subredditSubscriptions.forEach((actualSubscription) => {
          subscriptions.push(actualSubscription.name);
        });
        requestInfo.message = constants.messages.info.SUBSCRIPTIONS;
        requestInfo.message += subscriptions.join(', ');
      }
      sendTelegramMessage(constants.urls.GIBOT, requestInfo);
      return res.status(200).json();
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      error: constants.messages.error.UNEXPECTED
    });
  }
}