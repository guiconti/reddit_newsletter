/**
 * Module to check all subscriptions for a chat id
 * @module controllers/subscriptions
 */
const _ = require('underscore');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');

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

  try {
    let subscriptions = [];
    for (let key in savedPosts){
      if (savedPosts[key].subscriptions.includes(params.chatId)){
        subscriptions.push(key);
      }
    }
    return res.status(200).json({
      msg: subscriptions
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.status(500).json({
      error: constants.messages.error.UNEXPECTED
    });
  }
}