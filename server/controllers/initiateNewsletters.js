/**
 * Module to initiate all newletters in database
 * @module controllers/initiateNewsletters
 */
const _ = require('underscore');
const mongoose = require('mongoose');
const SubredditModel = mongoose.model('Subreddit');
const logger = require('../../tools/logger');
const constants = require('../utils/constants');
const validation = require('../utils/validation');

/**
 * Initiate all newsletters
 *
 * @throws {Error} - Rejects the promise with an error message
 */
module.exports = () => {
  SubredditModel.find({}, 'name subscriptions')
    .then((subscriptions) => {
      console.log(subscriptions);
    })
    .catch((err) => {
      logger.critical(err);
    });
};

